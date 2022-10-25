import express from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import { addRole, deleteRole, getRoleIndex, updateRole, updateUserRole } from '../Services/RoleService';

const router = express.Router();
router.get('/index', getRoleIndex);
router.post('/create', addRole);
router.put('/update/:id', updateRole);
router.delete('/delete/:id', deleteRole);
router.put('/update-user-role', updateUserRole);


export default router;
