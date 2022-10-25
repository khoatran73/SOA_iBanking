import { CoreEntity, Identifier } from './shared';

export interface IRole extends CoreEntity {
    code: string;
    name: string;
}

export interface RoleGrid extends IRole {
    userIds: string[]
}

export interface UserRoleUpdateRequest {
    roleId: Identifier;
    userIds: string[]
}

export interface IUserRole {
    roleId: Identifier;
    userId: string;
}
