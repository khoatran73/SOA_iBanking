import express from 'express';
import { create, index, payment, getTuitionSuggest, update , paymentRequest  ,getTuitionHistory, remove } from '../Services/TuitionService';


const router = express.Router();

router.get('/index', index);
router.get('/tuition-history', getTuitionHistory);
router.get('/request/:id', paymentRequest);
router.get('/get-suggest', getTuitionSuggest);
router.post('/create', create);
router.post('/payment/:id', payment);
router.put('/update/:id', update);
router.delete('/delete/:id', remove);

export default router;
