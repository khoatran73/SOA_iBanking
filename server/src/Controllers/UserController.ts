import express from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import { comboUser, index } from '../Services/IdentityService';

const router = express.Router();
router.get('/get-combo', comboUser);
router.get('/get-list-user', index);  

export default router;
