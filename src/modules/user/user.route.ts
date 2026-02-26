import { Router } from 'express';
import { UserController } from './user.controller';
import { UserRoles } from '../../../generated/prisma/enums';
import authMiddleware from '../../middleware/auth.middleware';

const router = Router();

router.get(
  '/me',
  authMiddleware(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN),
  UserController.getUser,
);

router.put(
  '/update',
  authMiddleware(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN),
  UserController.updateUserData,
);

export const UserRouter = router;
