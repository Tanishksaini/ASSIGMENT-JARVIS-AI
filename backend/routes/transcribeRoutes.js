import { Router } from 'express';
import { transcribeAudio } from '../controllers/transcribeController';
const router = Router();

router.post('/transcribe', transcribeAudio);

export default router;
