import express from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import { addUser, checkLogin, login } from '../Services/IdentityService';

const router = express.Router();

router.get('/check-login', checkLogin);
router.post('/add-user', Authenticate, addUser);
router.post('/login', login);

export default router;
