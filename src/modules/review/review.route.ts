import { Router } from 'express';
import { UserRoles } from '../../../generated/prisma/enums';
import { reviewController } from './review.controller';
import authMiddleware from '../../middleware/auth.middleware';

const router = Router();

router.post(
  '/create',
  authMiddleware(UserRoles.STUDENT),
  reviewController.createReview,
);
router.put(
  '/update/:reviewId',
  authMiddleware(UserRoles.STUDENT),
  reviewController.updateReview,
);

export const reviewRouter = router;
