import { Application } from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import CommonController from './CommonController';
import IdentityController from './IdentityController';
import MenuController from './MenuController';
import RoleController from './RoleController';
import TuitionController from './TuitionController';
import SemesterController from './SemesterController';
import UserController from './UserController';

const route = (app: Application) => {
    app.use('/api/identity', IdentityController);
    app.use('/api/user', UserController);
    app.use('/api/menu', Authenticate, MenuController);
    app.use('/api/role', Authenticate, RoleController);
    app.use('/api/common', Authenticate, CommonController);
    app.use('/api/tuition', Authenticate, TuitionController);
    app.use('/api/semester', Authenticate, SemesterController);
};

export default route;