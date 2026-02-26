import Router from 'express';

import authMiddleware from '../../middleware/auth.middleware';
import { availabilityController } from './availability.controller';
import { UserRoles } from '../../../generated/prisma/enums';

const router = Router();

router.get(
  '/',
  authMiddleware(UserRoles.TUTOR),
  availabilityController.getAvailabilitiesByTutor,
);

router.post(
  '/create',
  authMiddleware(UserRoles.TUTOR),
  availabilityController.createAvailability,
);

router.put(
  '/:availabilityId',
  authMiddleware(UserRoles.TUTOR),
  availabilityController.updateAvailability,
);

router.delete(
  '/:availabilityId',
  authMiddleware(UserRoles.TUTOR),
  availabilityController.deleteAvailability,
);

export const availabilityRouter = router;
