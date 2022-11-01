import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { generateUUID } from '../common/GenerateUUID';
import { PaginatedListConstructor, PaginatedListQuery } from '../common/PaginatedList';
import SendMail, { SendMailProps } from '../common/SendMail';
import Role from '../Models/Role';
import { AuthUser, NewUser, LoginParams, AppUser } from '../types/Identity';
import { ComboOption } from '../types/shared';
import User from './../Models/User';
import UserRole from './../Models/UserRole';

declare module 'express-session' {
    interface SessionData {
        user: AppUser;
    }
}

export const index = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const users = await User.find();

    const results = users.map(user =>{
        return {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            isSupper: user.isAdmin,
            emailAddress: user.emailAddress,
            phoneNumber: user.phoneNumber,
            amount: user.amount,
        } as AppUser;
    });
    
    const response = PaginatedListConstructor<any>(results, req.query.offset, req.query.limit);

    return res.json(ResponseOk<AppUser[]>(response));
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
        const data = req.body;
        const isExistUser = Boolean(await User.findOne({ username: req.body.username }));
        const password = req.body.password ?? "123456";
        const userCode = `519${Math.floor(Math.random() * 100000 + 1).toString()}`
        if (isExistUser) {
            return res.json(ResponseFail('UserName existed!'));
        }

        const user = new User({
            ...data,
            id: generateUUID(),
            username:data.username,
            userCode: userCode,
        });
        user.setPassword(password);
        user.save();
        const paramSendMail: SendMailProps = {
            emailTo: user.emailAddress,
            subject:'Thông tin tài khoản!',
            html: `
                <div><p>Xin chào <b>${user.fullName}</b></a></p></div>
                <div><p>Mã sinh viên của bạn là: <b>${user.userCode}</b></a></p></div>
                <div><p>Bạn vừa tạo mới tài khoản với tên đăng nhập: <strong style="font-size:20px;color:red">${user.username}</strong> </p></div> <br/><br/>
                <div><p>Mật khẩu của bạn là: <strong style="font-size:20px;color:red">${password}</strong></p></div> <br/><br/>
                <p>Xin cảm ơn,</p>
            `,
        }
        await SendMail(paramSendMail);
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
            emailAddress: user.emailAddress,
            fullName: user.fullName,
            id: user.id,
            isSupper: isSupper,
            username: user.username,
            phoneNumber: user.phoneNumber,
            amount: user.amount,
        },
    };
    req.session.user = result.user;

    return res.json(ResponseOk(result));
};

export const logout = (req: Request, res: Response) => {
    if (req.session.user) delete req.session.user;
    return res.json(ResponseOk());
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) throw new Error('User not found');
        const result = {
            id: user.id,
            fullName: user.fullName,
            emailAddress: user.emailAddress,
            amount: user.amount,
            userCode: user.userCode,
        };
        return res.json(ResponseOk(result));
    } catch (err: any) {
        return res.json(ResponseFail(err));
    }
};

export const comboUser = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        const result = users.map(
            user =>
                ({
                    value: user.id,
                    label: user.fullName,
                } as ComboOption),
        );

        return res.json(ResponseOk(result));
    } catch (err: any) {
        return res.json(ResponseFail(err));
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        await User.findOneAndDelete({id: req.params.id})
        return res.json(ResponseOk());
    } catch (err: any) {
        return res.json(ResponseFail(err));
    }
};
