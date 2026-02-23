import { Router } from 'express';
import { TutorController } from './tutor.controller';
import authMiddleware from '../../middleware/auth.middleware';
import { UserRoles } from '../../../generated/prisma/enums';

const router = Router();

router.get('/', TutorController.getAllTutors);
router.get('/:Id', TutorController.getTutorById);
router.put(
  '/update',
  authMiddleware(UserRoles.TUTOR),
  TutorController.updateTutor,
);

router.put(
  '/subjects',
  authMiddleware(UserRoles.TUTOR),
  TutorController.updateTutorSubjects,
);

router.delete(
  '/subjects/:subjectId',
  authMiddleware(UserRoles.TUTOR),
  TutorController.deleteTutorSubject,
);

export const TutorRouter = router;
