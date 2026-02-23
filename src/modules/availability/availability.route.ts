import Router from 'express';

import authMiddleware from '../../middleware/auth.middleware';
import { availabilityController } from './availability.controller';
import { UserRoles } from '../../../generated/prisma/enums';

const router = Router();

router.post(
  '/create',
  authMiddleware(UserRoles.TUTOR),
  availabilityController.createAvailability,
);

export const availabilityRouter = router;
