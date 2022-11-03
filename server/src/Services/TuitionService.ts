import { Request, Response } from 'express';
import _, { isEmpty, isNull } from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { PaginatedListConstructor, PaginatedListQuery } from '../common/PaginatedList';
import Tuition, { ITuition } from '../Models/Tuition';
import { startSession } from 'mongoose';
import dotenv from 'dotenv';
import User from '../Models/User';
import Otp from '../Models/Otp';
import SendMail, { SendMailProps } from '../common/SendMail';
import { generateUUID } from '../common/GenerateUUID';
dotenv.config();

export const index = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const isSupper = req.session.user?.isSupper;
    let params: any = {
        status: 'waiting',
    };
    params = !isSupper ? { userId: req.session.user?.id, ...params } : params;
    const tuitionByUser = await Tuition.find(params);
    const users = await User.find();
    const tuitions = tuitionByUser.map(tuition => {
        const user = users.find(user => user.id === tuition.userId);
        return {
            ...tuition.toJSON(),
            userId: user?.id,
            userName: user?.fullName,
            userCode: user?.userCode,
        };
    });

    const response = PaginatedListConstructor<any>(tuitions, req.query.offset, req.query.limit);

    return res.json(ResponseOk<ITuition[]>(response));
};

export const paymentRequest = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    try {
        const id = req.params.id;
        const tuition = await Tuition.findOne({ id: id, status: 'waiting', processing: false });
        if (!Boolean(tuition)) {
            return res.json(ResponseFail('Không có khoản nợ học phí nào, hoặc đã được thanh toán!'));
        }
        const user = await User.findOne({ id: req.session.user?.id });
        const userEmail = user?.emailAddress;
        const codeOTP = Number(Math.floor(Math.random() * 1000000 + 1));
        await Otp.create({
            otpCode: codeOTP,
            expireAfterSeconds: 60,
        });
        const paramSendMail: SendMailProps = {
            emailTo: userEmail,
            subject: 'Mã dùng một lần của bạn!',
            html: `
                <div><p>Xin chào <a href="#">${userEmail}</a></p></div>
                <div><p>Chúng tôi đã nhận yêu cầu mã dùng một lần để dùng cho thanh toán học phí của bạn.</p></div> <br/><br/>
                <div><p>Mã dùng 1 lần của bạn là: <strong style="font-size:20px;color:red">${codeOTP}</strong></p></div> <br/><br/>
                <div><p>Nếu không yêu cầu mã này thì bạn có thể vui lòng bỏ qua một cách an toàn.</p></div></br><br/>
                <div><p>Có thể ai đó đã nhập địa chỉ email của bạn do nhầm lẫn.</p></div></br><br/>
                <p>Xin cảm ơn,</p>
            `,
        };
        await SendMail(paramSendMail);
        return res.json(ResponseOk());
    } catch (e: any) {
        console.log('Error', e);
        return res.json(ResponseFail());
    }
};

export const create = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const session = await startSession();
    try {
        session.startTransaction();
        const data = req.body;

        const isExistTuition = await Tuition.find({
            $or: [{ tuitionCode: data?.tuitionCode }, { userId: data.userId, semester: data.semester }],
        });

        if (!isEmpty(isExistTuition)) {
            return res.json(ResponseFail('Mã học phí hoặc sinh viên  không được tạo trùng!'));
        }
        const tuition = new Tuition({
            id: generateUUID(),
            userId: data.userId,
            tuitionCode: data.tuitionCode,
            totalFee: data.totalFee,
            semester: data.semester,
            expiredAt: data.expiredAt,
        });
        tuition.save();
        await session.commitTransaction();
        session.endSession();
        return res.json(ResponseOk());
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

export const update = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {};

export const payment = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const session = await startSession();
    const userId = req.body.userPaymentId;
    const otpCode = req.body.otpCode;

    try {
        session.startTransaction();
        const otp = await Otp.findOneAndRemove({ otpCode: otpCode });
        const tuition = await Tuition.findOneAndUpdate({ id: req.params.id, status: 'waiting' }, { processing: true });
        const user = await User.findOne({ id: userId });

        if (!Boolean(tuition)) throw new Error('Không có khoản nợ học phí nào, hoặc đã được thanh toán!');
        if (!Boolean(otp)) throw new Error('Mã xác thực không hợp lệ!');
        if (!Boolean(user)) throw new Error('Người dùng không tồn tại!');

        const tuitionFee = Number(tuition?.totalFee);
        const amount = Number(user?.amount);

        if (amount < tuitionFee) throw new Error('Số dư không khả dụng');

        user?.set({ amount: amount - tuitionFee });
        tuition?.set({
            status: 'paid',
            userPaymentId: user?.id,
            processing: false,
        });
        await user?.save();
        await tuition?.save();
        const paramSendMail: SendMailProps = {
            emailTo: user?.emailAddress,
            subject: 'Hóa đơn điện tử !',
            html: `
            <div>
            <span style="color: rgb(240, 119, 119)"><strong>Chú ý :</strong><i> Đây là email tự động vui lòng không phản hồi lại email này !</i></span>
            <div>
                <span><strong>Kính gửi:</strong> <b>quý khách chuyển khoản (${user?.fullName})</b></span>
            </div>
            <div>
                <ul>
                    <li>
                        <span><strong>Người thanh toán:</strong>${user?.fullName}</span>
                    </li>
                    <li>
                        <span><strong>Lí do :</strong>Thanh toán học phí học kì ${tuition?.semester}</span>
                    </li>
                    <li>
                        <span><strong>Ngày thanh toán :</strong>${new Date().toLocaleString()}</span>
                    </li>
                    <li>
                        <span><strong>Số tiền :</strong>${tuition?.totalFee}</span>
                    </li>
                </ul>
                <div>Thông tin chi tiết liên hệ: <a href="http://doanhkiemduocem.com.vn">Tại đây</a></div>
            </div>
        </div>
            `,
        };
        await SendMail(paramSendMail);
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
        const tuition = await Tuition.findOne({ userId: user?.id, semester: req.query.semester, status: 'waiting' });
        if (!Boolean(tuition) || !Boolean(user)) throw new Error('Không tìm thấy học phí hợp lệ !');
        const result = {
            ...tuition?.toJSON(),
            userId: user?.id,
            userName: user?.fullName,
            userCode: user?.userCode,
        };
        return res.json(ResponseOk(result));
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

export const getTuitionHistory = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const tuitionHistoryByUser = await Tuition.find({
        userPaymentId: req.session.user?.id,
        status: 'paid',
    });
    const users = await User.find();
    const tuitions = tuitionHistoryByUser.map(tuition => {
        const user = users.find(user => user.id === tuition.userId);
        return {
            ...tuition.toJSON(),
            userId: user?.id,
            userName: user?.fullName,
            userCode: user?.userCode,
        };
    });

    const response = PaginatedListConstructor<any>(tuitions, req.query.offset, req.query.limit);

    return res.json(ResponseOk<ITuition[]>(response));
};

export const remove = async (req: Request, res: Response) => {
    try {
        await Tuition.findOneAndDelete({ id: req.params.id });
        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail);
    }
};
