import { Application } from 'express';
import IdentityController from './IdentityController';
import MenuController from './MenuController';

const route = (app: Application) => {
    app.use('/api/identity', IdentityController);
    app.use('/api/menu', MenuController);
};

export default route;
