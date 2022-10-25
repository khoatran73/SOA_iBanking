import express from 'express';
import { comboUserWithKey } from '../Services/CommonService';

const router = express.Router();

router.get('/combo-user-with-key', comboUserWithKey);

export default router;
