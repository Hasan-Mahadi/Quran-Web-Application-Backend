import { Router } from 'express';
import { SurahController } from '../controllers/surahController';

const router = Router();
const surahController = new SurahController();

router.get('/', surahController.getAllSurahs.bind(surahController));
router.get('/:id', surahController.getSurahById.bind(surahController));

export default router;