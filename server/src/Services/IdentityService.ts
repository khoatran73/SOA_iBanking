import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { AuthUser, NewUser, LoginParams } from '../types/Identity';
import User from './../Models/User';

declare module 'express-session' {
    interface SessionData {
        user: any;
    }
}

export const checkLogin = (req: Request, res: Response) => {
    const user = req.session.user;
    if (user){
        const result: AuthUser = {
            rights: [''],
            user
        };
        return res.json(ResponseOk(result));
    }
    return res.json(ResponseFail());
};

export const addUser = async (req: Request<any, any, NewUser>, res: Response) => {
    try {
        const isExistUser = Boolean(await User.findOne({ userName: req.body.userName }));

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
    const user = await User.findOne({ userName: req.body.userName });

    if (!user) {
        return res.json(ResponseFail('Tài khoản hoặc mật khẩu không đúng!'));
    }

    if (!user.validPassword(req.body.password)) {
        return res.json(ResponseFail('Tài khoản hoặc mật khẩu không đúng!'));
    }

    const result: AuthUser = {
        rights: [''],
        user: {
            email: user.emailAddress,
            fullName: user.fullName,
            id: user.id,
            isSupper: user.hasRoleAdminSystem(),
            userName: user.userName,
            phoneNumber: user.phoneNumber,
        },
    };
    req.session.user = result.user;

    return res.json(ResponseOk(result));
};
