import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../common/ApiResponse';
import { PaginatedListConstructor, PaginatedListQuery } from '../common/PaginatedList';
import Subject, { ISubject } from '../Models/Subject';

export const index = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const subject = await Subject.find();

    const result = PaginatedListConstructor<ISubject>(subject, req.query.offset, req.query.limit);

    return res.json(ResponseOk<ISubject[]>(result));
};

export const create = async (req: Request<any, any, ISubject>, res: Response) => {
    try {
        const isExistSubject = Boolean(await Subject.findOne({ subjectCode: req.body?.subjectCode }));

        if (isExistSubject) {
            return res.json(ResponseFail('Subject đã tồn tại!'));
        }

        const subject = new Subject({
            ...req.body,
        });

        subject.save();

        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

export const update = async (req: Request<any, any, ISubject>, res: Response) => {
    try {
        const id = req.params.id;

        const subject = await Subject.findOne({ id: id });

        if (!subject) {
            return res.json(ResponseFail('Subject not found!'));
        }

        await Subject.updateOne(
            { id: id },
            {
                ...req.body,
            },
        );
        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

export const remove = async (req: Request<any, any, ISubject>, res: Response) => {
    try {
        const id = req.params.id;

        const subject = await Subject.findOne({ id: id });

        if (!subject) {
            return res.json(ResponseFail('Subject not found!'));
        }

        subject.remove();
        
        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};
