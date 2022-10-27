import express from 'express';
import { create , getCombo} from '../Services/SemesterService';


const router = express.Router();

router.get('/combo', getCombo);
router.post('/create', create);


export default router;
