import express from 'express';
import { create, index, payment, remove, update } from '../Services/TuitionService';


const router = express.Router();

router.get('/index', index);
router.post('/create', create);
router.put('/update/:id', update);
router.put('/payment/:id', payment);
router.delete('/delete/:id', remove);

export default router;
