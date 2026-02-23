import express from 'express';
import { BookingController } from './booking.controller';
import authMiddleware from '../../middleware/auth.middleware';
import { UserRoles } from '../../../generated/prisma/enums';

const router = express.Router();

router.get(
  '/',
  authMiddleware(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN),
  BookingController.getAllBookings,
);

router.post(
  '/create',
  authMiddleware(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN),
  BookingController.createBooking,
);

router.put(
  '/:bookingId/status',
  authMiddleware(UserRoles.STUDENT, UserRoles.TUTOR, UserRoles.ADMIN),
  BookingController.updateBookingStatus,
);

export const BookingRouter = router;
