import { Model, model, Schema } from 'mongoose';
import { IUserRole } from '../types/Role';

interface IUserRoleMethod {}

type UserRoleModel = Model<IUserRole, {}, IUserRoleMethod>;

const schema = new Schema<IUserRole, UserRoleModel, IUserRoleMethod>({
    roleId: { type: String, required: true },
    userId: { type: String, required: true },
});

const UserRole = model<IUserRole, UserRoleModel>('UserRole', schema);

export default UserRole;
