import { Request, Response, NextFunction } from 'express';
const Authenticate = (req: Request, res: Response, next: NextFunction) => {
    next();
    // if (req.session.user) {
    //     next();
    // } else {
    //     res.status(403).json({ success: false, message: 'UnAuthorized' });
    // }
};

export default Authenticate;
