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

const getAvailabilitiesByTutor = async (req: Request, res: Response) => {
  try {
    const tutor = req.tutorId;

    const result = await availabilityService.getAvailabilitiesByTutor(
      tutor as string,
    );

    return res.json({
      success: true,
      message: 'Tutor availability data retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error retrieving tutor availability data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tutor availability data',
      error: error.message || 'Internal Server Error',
    });
  }
};

const updateAvailability = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const tutorId = req.tutorId as string;
    const availabilityId = req.params.availabilityId as string;
    const result = await availabilityService.updateAvailability(
      availabilityId,
      data,
      tutorId,
    );
    res.json({
      success: true,
      message: 'Tutor availability slot updated successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

const deleteAvailability = async (req: Request, res: Response) => {
  try {
    if (!req.tutorId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No tutor ID found in request',
      });
    }

    const result = await availabilityService.deleteAvailability(
      req.params.availabilityId as string,
      req.tutorId,
    );

    return res.json({
      success: true,
      message: 'Tutor availability slot deleted successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
export const availabilityController = {
  createAvailability,
  getAvailabilitiesByTutor,
  updateAvailability,
  deleteAvailability,
};
