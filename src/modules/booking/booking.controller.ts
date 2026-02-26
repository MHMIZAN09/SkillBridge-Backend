import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import {
  BookingStatus,
  User,
  UserRoles,
} from '../../../generated/prisma/client';

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await BookingService.getAllBookings(
      req.user as User,
      req.tutorId as string,
    );
    return res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: error.message || 'An unexpected error occurred',
    });
  }
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const studentId = req.user?.id;
    const result = await BookingService.createBooking(
      payload,
      studentId as string,
    );
    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message || 'An unexpected error occurred',
    });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }
    if (!Object.values(BookingStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const tutorId = req.user?.role === UserRoles.TUTOR ? req.tutorId : null;
    const bookingId = req.params.bookingId as string;

    const result = await BookingService.updateBookingStatus(
      bookingId,
      status,
      req.user as User,
      tutorId,
    );
    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message || 'An unexpected error occurred',
    });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId as string;
    const result = await BookingService.getBookingById(bookingId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: error.message || 'An unexpected error occurred',
    });
  }
};

export const BookingController = {
  getAllBookings,
  createBooking,
  updateBookingStatus,
  getBookingById,
};
