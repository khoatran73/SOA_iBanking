import { Schema, Model, model } from 'mongoose';

export interface IOtp{
    otpCode: Number;
}
type OtpModel = Model<IOtp, {}, {}>;

const schema = new Schema<IOtp>({
    otpCode: { type: Number, unique: true},
},{timestamps: true});

const Otp = model<IOtp, OtpModel>('Otp', schema);

export default Otp;