import { Application } from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import IdentityController from './IdentityController';
import MenuController from './MenuController';

const route = (app: Application) => {
    app.use('/api/identity', IdentityController);
    app.use('/api/menu', Authenticate ,MenuController);
};

export default route;
