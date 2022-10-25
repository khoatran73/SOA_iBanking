import { Schema, Model, model } from 'mongoose';
import crypto from 'crypto';
import { IRole } from '../types/Role';

interface IRoleMethod {}

type RoleModel = Model<IRole, {}, IRoleMethod>;

const schema = new Schema<IRole, RoleModel, IRoleMethod>({
    id: { type: String, unique: true, required: true, default: crypto.randomUUID() },
    code: { type: String, required: true },
    name: { type: String, required: true },
});

const Role = model<IRole, RoleModel>('Role', schema);

export default Role;
