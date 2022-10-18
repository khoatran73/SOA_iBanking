import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { PaginatedListConstructor, PaginatedListQuery } from '../common/PaginatedList';
import Tuition, { ITuition } from '../Models/Tuition';

export const index = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const tuitionByUser = await Tuition.find({user: req.params.user.id});

    const result = PaginatedListConstructor<ITuition>(tuitionByUser, req.query.offset, req.query.limit);

    return res.json(ResponseOk<ITuition[]>(result));
};

export const create = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    try {
        const isExistTuition = Boolean(await Tuition.findOne({ tuitionCode: req.body?.tuitionCode }));

        if (isExistTuition) {
            return res.json(ResponseFail('Tuition đã tồn tại!'));
        }

        const tuition = new Tuition({
            ...req.body,
        });

        tuition.save();

        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
}

export const update = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    return res.json(ResponseOk(`Hello World update ${req.params.id}`));
}

export const remove = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    return res.json(ResponseOk(`Hello World remove ${req.params.id}`));
}