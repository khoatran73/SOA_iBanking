import express from 'express';
import { addUser, checkLogin, login } from '../Services/IdentityService';

const router = express.Router();

router.get('/check-login', checkLogin);
router.post('/add-user', addUser);
router.post('/login', login);

export default router;
