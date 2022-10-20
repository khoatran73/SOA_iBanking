import { Request, Response, NextFunction } from 'express';
const Authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authThenticated = req.session.user;
    if (authThenticated && authThenticated !== null) {
        req.body.user = authThenticated;
        next();
    } else {
        res.status(403).json({ success: false, message: 'UnAuthorized' });
    }
};

export default Authenticate;
