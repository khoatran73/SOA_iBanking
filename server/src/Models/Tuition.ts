import { Schema, Model, model } from 'mongoose';
import crypto from 'crypto';
import { Identifier } from '../types/shared';
import { IUser } from './User';
import { ISubject } from './Subject';

export type StatusTuition = {
    WAITING: 'waiting';
    PAID: 'pending';
    EXPIRED: 'expired';
};

export interface ITuition {
    id: Identifier;
    user: IUser;
    subject: ISubject;
    tuitionCode: string;
    totalFee: Number;
    totalCredit: Number;
    status: string;
    startDate: Date;
    endDate: Date;
    expiredAt: Date;
}
type TuitionModel = Model<ITuition, {}, {}>;

const schema = new Schema<ITuition>({
    id: { type: String, unique: true, required: true, default: crypto.randomUUID() },
    user: { type: Object, ref: 'User.id'},
    subject: [{ type: Object, ref: 'Subject.id' }],
    tuitionCode: { type: String, unique: true, required: true },
    totalFee: { type: Number, default: 0 },
    totalCredit: { type: Number, default: 0 },
    status: { type: String, default: 'waiting' },
    expiredAt: { type: Date, default: Date.now() + 86400000 }, // 1 day
},{timestamps: true});

const Tuition = model<ITuition, TuitionModel>('Tuition', schema);

export default Tuition;
