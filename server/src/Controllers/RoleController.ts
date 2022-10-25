import express from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import { addRole, deleteRole, getComboRole, getRoleIndex, updateRole, updateUserRole } from '../Services/RoleService';

const router = express.Router();
router.get('/index', getRoleIndex);
router.post('/create', addRole);
router.put('/update/:id', updateRole);
router.delete('/delete/:id', deleteRole);
router.get('/combo', getComboRole);
router.put('/update-user-role', updateUserRole);

export default router;
