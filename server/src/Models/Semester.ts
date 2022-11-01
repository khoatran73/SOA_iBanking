import { Schema, Model, model } from 'mongoose';
import { Identifier } from '../types/shared';
import { generateUUID } from '../common/GenerateUUID';

export interface ISemester{
    id:Identifier;
    name: String;
    code: String;
}
type SemesterModel = Model<ISemester, {}, {}>;

const schema = new Schema<ISemester>({
    id: { type: String, unique: true, required: true, default: generateUUID() },
    name: { type: String, required: true},
    code: { type: String, required: true, unique: true},
},{timestamps: true});

const Semester = model<ISemester, SemesterModel>('Semester', schema);

export default Semester;