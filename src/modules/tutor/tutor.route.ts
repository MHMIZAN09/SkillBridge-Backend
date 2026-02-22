import express from 'express';
import { TutorController } from './tutor.controller';

const router = express.Router();

router.get('/', TutorController.getAllTutors);

export const TutorRoutes = router;
