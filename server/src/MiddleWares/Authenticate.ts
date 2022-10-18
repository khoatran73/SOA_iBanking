import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
const secret = process.env.JWT_PRIVATE_KEY || 'secret';
const Authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']?.replace('Bearer ', '');
    if (authHeader && authHeader !== null) {
        jwt.verify(authHeader, secret, (err, user) => {
            if (err) {
                return res.status(403).send({ success: false, message: 'Token Expired' });
            }
            req.body.user = user;
            next();
        });
    } else {
        res.status(403).json({ success: false, message: 'UnAuthorized' });
    }
};

export default Authenticate;
