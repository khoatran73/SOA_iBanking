import { Schema, Model, model } from 'mongoose';
import crypto from 'crypto';
import { Identifier } from '../types/shared';

export interface IUser {
    id?: Identifier;
    username: string;
    passwordHash: string;
    salt: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    isAdmin: boolean;
}

interface IUserMethod {
    hasRoleAdminSystem: () => boolean;
    setPassword: (password: string) => void;
    validPassword: (password: string) => boolean;
}
type UserModel = Model<IUser, {}, IUserMethod>;

const schema = new Schema<IUser, UserModel, IUserMethod>({
    id: { type: String, unique: true, required: true, default: crypto.randomUUID() },
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, unique: true, required: true },
    salt: { type: String, unique: true, required: true },
    fullName: { type: String, default: '' },
    emailAddress: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
});

schema.methods.hasRoleAdminSystem = function () {
    return this.isAdmin;
};

schema.methods.setPassword = function (password: string) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);

    return {
        salt: this.salt,
        passwordHash: this.passwordHash,
    };
};

schema.methods.validPassword = function (password: string) {
    let passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);

    return this.passwordHash === passwordHash;
};

const User = model<IUser, UserModel>('User', schema);

export default User;
