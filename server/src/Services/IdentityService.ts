import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { AuthUser, NewUser, LoginParams } from '../types/Identity';
import User from './../Models/User';
import jwt from 'jsonwebtoken';
const jwtSecret: string = process.env.JWT_PRIVATE_KEY || 'secret';

export const checkLogin = (req: Request, res: Response) => {
    const result: AuthUser = {
        rights: [''],
        user: {
            email: 'khoa@gmail.com',
            fullName: 'khoa tran anh',
            id: 'this is user id',
            isSupper: true,
            userName: 'khoa.tran',
            orgId: 'this is org id',
            phoneNumber: '0909090',
        },
        token: 'this is token',
    };
    // return res.json(ResponseOk(result));
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

    // TODO: create session here
    const token = jwt.sign({ username: user.userName, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: '1h' });
    // save user info to session -> 1 hour -> 2
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
        token,
    };
    res.setHeader('authorization', token);

    return res.json(ResponseOk(result));
};
