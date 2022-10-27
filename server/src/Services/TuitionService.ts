import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { PaginatedListConstructor, PaginatedListQuery } from '../common/PaginatedList';
import Tuition, { ITuition } from '../Models/Tuition';
import { startSession } from 'mongoose';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../Models/User';
import Otp from '../Models/Otp';
dotenv.config();

export const index = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const tuitionByUser = await Tuition.find({
        userId: req.session.user?.id,
    });
    const user = await User.findOne({id: req.session.user?.id});
    const tuitions = tuitionByUser.map((tuition) => {
        return {
            ...tuition.toJSON(),
            userId:user?.id,
            userName: user?.fullName,
            userCode: user?.userCode,
        };
    })

    const response = PaginatedListConstructor<any>(tuitions, req.query.offset, req.query.limit);

    return res.json(ResponseOk<ITuition[]>(response));
};

export const paymentRequest = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const host = process.env.EMAIL_HOST;
    const username = process.env.EMAIL_USERNAME;
    const password = process.env.EMAIL_PASSWORD;

    try {
        const user = await User.findOne({ id: req.session.user?.id });
        const userEmail = user?.emailAddress;
        const codeOTP = Number(Math.floor(Math.random() * 1000000 + 1));
        await Otp.create({
            otpCode: codeOTP,
            expireAfterSeconds: 60,
        });
        const transporter = nodemailer.createTransport({
            host: host,
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: username,
                pass: password,
            },
            logger: true,
        });
        const info = await transporter.sendMail({
            from: 'No replies <hocphisinhvien@gmail.com>',
            to: userEmail,
            subject: 'Xác nhận thanh toán học phí !',
            text: 'Hello world?',
            html: `<strong>Mã xác nhân của bạn là <b style="color: red; font-weight: bold; font-size:20px">${codeOTP}</b></strong>`,
            headers: { 'x-cloudmta-class': 'standard' },
        });
        console.log('Message sent: %s', info.response);
        return res.json(ResponseOk());
    } catch (e: any) {
        console.log('Error', e);
        return res.json(ResponseFail());
    }
};

export const create = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    try {
        const isExistTuition = Boolean(await Tuition.findOne({ tuitionCode: req.body?.tuitionCode }));

        if (isExistTuition) {
            return res.json(ResponseFail('Tuition đã tồn tại!'));
        }
        const tuition = new Tuition({
            ...req.body,
        });
        tuition.save();

        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

export const update = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {};

export const payment = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const session = await startSession();
    const userId = req.body.userPaymentId ?? req.body.userId;
    const otpCode = req.body.otpCode;

    try {
        session.startTransaction();
        const otp = await Otp.findOneAndRemove({ otpCode: otpCode});
        const tuition = await Tuition.findOne({ id: req.params.id });
        const user = await User.findOne({ id: userId });

        if (!Boolean(tuition)) throw new Error('Không có khoản nợ học phí nào!');
        if (!Boolean(otp)) throw new Error('Mã xác thực không hợp lệ!');        
        if (!Boolean(user)) throw new Error('Người dùng không tồn tại!');

        const tuitionFee = Number(tuition?.totalFee);
        const amount = Number(user?.amount);

        if (amount < tuitionFee) throw new Error('Số dư không khả dụng');

        user?.set({ amount: amount - tuitionFee });
        tuition?.set({
            status: 'paid',
            userPaymentId: user?.id,
        });
        await user?.save();
        await tuition?.save();
        await session.commitTransaction();
        session.endSession();
        return res.json(ResponseOk());
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

export const getTuitionSuggest = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ userCode: req.query.userCode });
        console.log(user);
        const tuition = await Tuition.findOne({ userId: user?.id, semester: req.query.semester, status: 'waiting' });
        console.log(tuition)
        if (!Boolean(tuition) || !Boolean(user)) throw new Error('Không tìm thấy học phí hợp lệ !');
        const result = {
            ...tuition?.toJSON(),
            userId:user?.id,
            userName: user?.fullName,
            userCode: user?.userCode,
        }
        return res.json(ResponseOk(result));
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};
