import express from 'express';
import { create, index, payment, getTuitionSuggest, update , paymentRequest } from '../Services/TuitionService';


const router = express.Router();

router.get('/index', index);
router.get('/request', paymentRequest);
router.get('/get-suggest', getTuitionSuggest);
router.post('/create', create);
router.post('/payment/:id', payment);
router.put('/update/:id', update);

export default router;
