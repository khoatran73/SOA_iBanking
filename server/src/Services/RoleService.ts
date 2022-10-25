import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { PaginatedListConstructor, PaginatedListQuery } from '../common/PaginatedList';
import Role from '../Models/Role';
import User from '../Models/User';
import UserRole from '../Models/UserRole';
import { IRole, IUserRole, RoleGrid, UserRoleUpdateRequest } from '../types/Role';

export const getRoleIndex = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const roles = await Role.find();
    const userRoles = await UserRole.find();

    const roleGrids = roles.map(
        role =>
            ({
                id: role.id,
                code: role.code,
                name: role.name,
                userIds: userRoles.find(ur => ur.roleId === role.id)?.userId ?? [],
            } as RoleGrid),
    );

    const result = PaginatedListConstructor<RoleGrid>(roleGrids, req.query.offset, req.query.limit);
    return res.json(ResponseOk<RoleGrid[]>(result));
};

export const addRole = async (req: Request<any, any, IRole, any>, res: Response) => {
    try {
        const isExistRole = Boolean(await Role.findOne({ code: req.body.code }));
        if (isExistRole) {
            return res.json(ResponseFail('Code đã tồn tại!'));
        }
        const role = new Role({
            ...req.body,
        });
        role.save();
        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

export const updateRole = async (req: Request<{ id: string }, any, IRole, any>, res: Response) => {
    const id = req.params.id;

    const role = await Role.findOne({ id: id });

    if (!role) {
        return res.json(ResponseFail('Không tìm thấy Role!'));
    }

    await Role.updateOne(
        { id: id },
        {
            ...req.body,
        },
    );

    return res.json(ResponseOk());
};

export const deleteRole = async (req: Request<{ id: string }, any, IRole>, res: Response) => {
    const id = req.params.id;
    return Role.deleteOne({ id: id })
        .then(() => res.json(ResponseOk()))
        .catch(err => res.json(ResponseFail(err?.message)));
};

export const updateUserRole = async (req: Request<any, any, UserRoleUpdateRequest, any>, res: Response) => {
    const userRoles = await UserRole.find({ roleId: req.body.roleId });
    const { roleId, userIds } = req.body;
    const userRolesWillDelete: IUserRole[] = userRoles.filter(ur => !userIds.includes(ur.userId));
    const userRolesWillUpdate: IUserRole[] = userRoles.filter(ur => userIds.includes(ur.userId));
    const userRolesWillAdd: IUserRole[] = [];
    userIds.forEach(userId => {
        if (!userRolesWillUpdate.map(x => x.userId).includes(userId))
            userRolesWillAdd.push({
                roleId: roleId,
                userId: userId,
            } as IUserRole);
    });

    // await UserRole.deleteMany({ id: id });
    // await UserRole.addMenu 

    return res.json(ResponseOk())
};
