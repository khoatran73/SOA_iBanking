import { Request, Response } from 'express';
import _ from 'lodash';
import { ApiResponse, ResponseFail, ResponseOk } from '../common/ApiResponse';
import { AuthUser, NewUser, LoginParams, AppUser } from '../types/Identity';
import { ComboOptionWithKey } from '../types/shared';
import User from './../Models/User';

export const comboUserWithKey = async (req: Request, res: Response) => {
    const users = await User.find({ isAdmin: { $ne: true } });

    const result = users.map(
        user =>
            ({
                key: user.id,
                label: `${user.fullName} (${user.username})`,
            } as ComboOptionWithKey),
    );

    return res.json(ResponseOk<ComboOptionWithKey>(result));
};
