import express from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import { addUser, checkLogin, login, logout, getUser,remove } from '../Services/IdentityService';

const router = express.Router();

router.get('/check-login', checkLogin);
router.post('/login', login);
router.post('/add-user', Authenticate, addUser);
router.delete('/delete/:id', Authenticate, remove);
router.get('/logout', Authenticate, logout);
router.get('/get-user/:id', Authenticate, getUser);

export default router;
