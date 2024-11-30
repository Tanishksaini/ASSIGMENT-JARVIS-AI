import { Router } from 'express';
import { listAudioFiles } from '../controllers/audioController';
const router = Router();

router.get('/list', listAudioFiles);

export default router;
