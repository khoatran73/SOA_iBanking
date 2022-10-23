import express from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import { addMenu, getMenuIndex, getMenuLayout, updateMenu, deleteMenu } from '../Services/MenuService';

const router = express.Router();
router.get('/layout', getMenuLayout);
// @ts-ignore
router.get('/index', getMenuIndex);
router.post('/create', addMenu);
router.put('/update/:id', updateMenu);
router.delete('/delete/:id', deleteMenu);

export default router;
