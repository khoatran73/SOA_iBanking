import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { PaginatedListConstructor, PaginatedListQuery } from '../common/PaginatedList';
import Semester from '../Models/Semester';
import { ComboOption } from '../types/shared';


export const getCombo = async (req: Request, res: Response) => {
    const semester = await Semester.find();

    const result = semester.map(
        semester =>
            ({
                value: semester.code,
                label: semester.name,
            } as ComboOption),
    );

    return res.json(ResponseOk(result));
};

export const create = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    try {
        const isExistSemester = Boolean(await Semester.findOne({ code: req.body?.code }));

        if (isExistSemester) {
            return res.json(ResponseFail('Semester đã tồn tại!'));
        }
        const semester = new Semester({
            ...req.body,
        });
        semester.save();

        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};