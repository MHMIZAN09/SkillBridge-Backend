import { NextFunction, Request, Response } from 'express';
import { availabilityService } from './availability.service';

const createAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await availabilityService.createAvailability(
      req.body,
      req.user.id,
    );

    res.json({
      success: true,
      message: 'Tutor availability slot created successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Availability creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

export const availabilityController = { createAvailability };
