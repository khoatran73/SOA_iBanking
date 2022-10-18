import { Schema, Model, model } from 'mongoose';
import crypto from 'crypto';
import { Identifier } from '../types/shared';

export interface ISubject{
    _id?: Schema.Types.ObjectId,
    id: Identifier;
    subjectName: string;
    subjectCode: string;
    subjectFee: Number;
    credits: Number;
}
type SubjectModel = Model<ISubject, {}, {}>;

const schema = new Schema<ISubject>({
    id: { type: String, unique: true, required: true, default: crypto.randomUUID() },
    subjectName: { type: String, unique: true, required: true },
    subjectCode: { type: String, unique: true, required: true },
    subjectFee: { type: Number, required: true },
    credits: { type: Number, required: true },
});

const Subject = model<ISubject, SubjectModel>('Subject', schema);

export default Subject;