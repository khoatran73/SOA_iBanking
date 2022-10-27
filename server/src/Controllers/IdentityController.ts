import express from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import { addUser, checkLogin, login, logout ,getUser} from '../Services/IdentityService';

const router = express.Router();

router.get('/check-login', checkLogin);
router.post('/login', login);
router.post('/add-user', Authenticate, addUser);
router.get('/logout', Authenticate, logout);
router.get('/get-user/:id', Authenticate, getUser);

export default router;
