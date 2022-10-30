import { Schema, Model, model } from 'mongoose';
import crypto from 'crypto';
import { Identifier } from '../types/shared';
import { IUser } from './User';


export type StatusTuition = {
    WAITING: 'waiting';
    PAID: 'pending';
    EXPIRED: 'expired';
};

export interface ITuition {
    id: Identifier;
    userId: Identifier;
    userPaymentId?: Identifier;
    tuitionCode: string;
    totalFee: Number;
    status: string;
    startDate: Date;
    semester:string;
    endDate: Date;
    expiredAt: Date;
}
type TuitionModel = Model<ITuition, {}, {}>;

const schema = new Schema<ITuition>(
    {
        id: { type: String, unique: true, required: true, default: crypto.randomUUID() },
        userId: { type: String, required: true },
        userPaymentId: { type: String},
        tuitionCode: { type: String, unique: true, required: true },
        semester: { type: String, required: true },
        totalFee: { type: Number, default: 0, required: true },
        status: { type: String, default: 'waiting' },
        expiredAt: { type: Date, default: Date.now() + 86400000 }, // 1 day
    },
    { timestamps: true },
);

const Tuition = model<ITuition, TuitionModel>('Tuition', schema);

export default Tuition;
