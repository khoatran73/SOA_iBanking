import { CoreEntity, Identifier } from '../shared';

export interface Role extends CoreEntity {
    code: string;
    name: string;
}

export interface RoleGrid extends Role {
    userIds: string[];
}

export interface UserRole {
    roleId: Identifier;
    userId: Identifier;
}
