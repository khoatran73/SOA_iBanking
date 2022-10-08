import express from 'express';
import { getMenuIndex, getMenuLayout } from '../Services/MenuService';

const router = express.Router();

router.get('/index', getMenuIndex);
router.get('/layout', getMenuLayout);

export default router;
