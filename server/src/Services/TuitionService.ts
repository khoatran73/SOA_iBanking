import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { PaginatedListConstructor, PaginatedListQuery } from '../common/PaginatedList';
import Tuition, { ITuition } from '../Models/Tuition';
import { startSession } from 'mongoose';
import User from '../Models/User';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const index = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const tuitionByUser = await Tuition.find({ 
        'user.id': req.session.user?.id,
    });

    const result = PaginatedListConstructor<ITuition>(tuitionByUser, req.query.offset, req.query.limit);

    return res.json(ResponseOk<ITuition[]>(result));
};

export const paymentRequest = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const host = process.env.EMAIL_HOST;
    const username = process.env.EMAIL_USERNAME;
    const password = process.env.EMAIL_PASSWORD;
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
        from: '"Sender Name" <from@cloudmta.com>',
        to: 'to@example.com',
        subject: 'Hello from node',
        text: 'Hello world?',
        html: '<strong>Hello world?</strong>',
        headers: { 'x-cloudmta-class': 'standard' },
    });

    console.log('Message sent: %s', info.response);
};

export const create = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    try {
        const isExistTuition = Boolean(await Tuition.findOne({ tuitionCode: req.body?.tuitionCode }));

        if (isExistTuition) {
            return res.json(ResponseFail('Tuition đã tồn tại!'));
        }
        const tuition = new Tuition({
            ...req.body,
            user: req.session.user,
        });
        tuition.save();

        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

export const update = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    // const session = await startSession();
    // try {
    //     session.startTransaction();
    //     const tuition = await Tuition.findOneAndUpdate(
    //         {
    //             id: req.params.id,
    //         },
    //         { ...req.body },
    //     );
    //     await tuition?.save();
    //     await session.commitTransaction();
    //     session.endSession();
    //     return res.json(ResponseOk());
    // } catch (err) {
    //     await session.abortTransaction();
    //     session.endSession();
    //     return res.json(ResponseFail(_.get(err, 'message')));
    // }
};

export const payment = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const session = await startSession();
    const userId = req.session.user?.id;
    try {
        session.startTransaction();
        const user = await User.findOne({ id: userId });
        const tuition = await Tuition.findOne({
            id: req.params.id,
        });
        const tuitionFee = Number(tuition?.totalFee);
        const amount = Number(user?.amount);

        if (amount < tuitionFee) throw new Error('Số dư không khả dụng');
        if (!Boolean(tuition)) throw new Error('Không có khoản nợ học phí nào!');

        user?.set({ amount: amount - tuitionFee });
        tuition?.set({ status: 'paid' });
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

export const remove = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    try {
        await Tuition.findOneAndDelete({ id: req.params.id });
        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};
