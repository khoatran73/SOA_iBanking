import express from 'express';
import { addMenu, getMenuIndex, getMenuLayout, updateMenu, deleteMenu } from '../Services/MenuService';

const router = express.Router();

router.get('/index', getMenuIndex);
router.get('/layout', getMenuLayout);
router.post('/create', addMenu);
router.put('/update/:id', updateMenu);
router.delete('/delete', deleteMenu);

export default router;
