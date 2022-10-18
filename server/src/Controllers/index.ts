import { Application } from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import IdentityController from './IdentityController';
import MenuController from './MenuController';
import SubjectController from './SubjectController';
import TuitionController from './TuitionController';

const route = (app: Application) => {
    app.use('/api/identity', IdentityController);
    app.use('/api/menu', Authenticate, MenuController);
    app.use('/api/tuition', Authenticate, TuitionController);
    app.use('/api/subject', Authenticate, SubjectController);
};

export default route;
