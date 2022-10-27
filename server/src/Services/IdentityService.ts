import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import Role from '../Models/Role';
import { AuthUser, NewUser, LoginParams, AppUser } from '../types/Identity';
import User from './../Models/User';
import UserRole from './../Models/UserRole';

declare module 'express-session' {
    interface SessionData {
        user: AppUser;
    }
}

export const checkLogin = async (req: Request, res: Response) => {
    const user = req.session.user;
    if (user) {
        const isSupper = user.isSupper;
        const userRoles = await UserRole.find({ userId: user.id });
        const roleIds = userRoles.map(x => x.roleId);
        const roles = isSupper ? await Role.find() : await Role.find({ id: { $in: roleIds } });
        const rolesCode = roles.map(x => x.code);

        const result: AuthUser = {
            rights: rolesCode,
            user,
        };
        return res.json(ResponseOk(result));
    }
    return res.json(ResponseFail());
};

export const addUser = async (req: Request<any, any, NewUser>, res: Response) => {
    try {
        const isExistUser = Boolean(await User.findOne({ username: req.body.username }));

        if (isExistUser) {
            return res.json(ResponseFail('UserName existed!'));
        }

        const user = new User({
            ...req.body,
        });

        user.setPassword(req.body.password);
        user.save();

        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

export const login = async (req: Request<any, any, LoginParams>, res: Response) => {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
        return res.json(ResponseFail('Tài khoản hoặc mật khẩu không đúng!'));
    }

    if (!user.validPassword(req.body.password)) {
        return res.json(ResponseFail('Tài khoản hoặc mật khẩu không đúng!'));
    }

    const isSupper = user.hasRoleAdminSystem();
    const userRoles = await UserRole.find({ userId: user.id });
    const roleIds = userRoles.map(x => x.roleId);
    const roles = isSupper ? await Role.find() : await Role.find({ id: { $in: roleIds } });
    const rolesCode = roles.map(x => x.code);

    const result: AuthUser = {
        rights: rolesCode,
        user: {
            email: user.emailAddress,
            fullName: user.fullName,
            id: user.id,
            isSupper: isSupper,
            username: user.username,
            phoneNumber: user.phoneNumber,
            amount: user.amount
        },
    };
    req.session.user = result.user;

    return res.json(ResponseOk(result));
};

export const logout = (req: Request, res: Response) => {
    if (req.session.user) delete req.session.user;
    return res.json(ResponseOk());
};

export const getUser = async(req: Request, res: Response) => {
    try{
        const user = await User.findOne({id: req.params.id})
        if (!user) throw new Error('User not found');
        const result = {
            id: user.id,
            fullName: user.fullName,
            emailAddress: user.emailAddress,
            amount: user.amount,
            userCode: user.userCode,
        }
        return res.json(ResponseOk(result));
    }catch(err:any){
        return res.json(ResponseFail(err));
    }
}
