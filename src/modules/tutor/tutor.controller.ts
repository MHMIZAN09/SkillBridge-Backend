import { Request, Response } from 'express';
import { TutorService } from './tutor.service';

const getAllTutors = async (req: Request, res: Response) => {
  // Logic to retrieve all tutors from the database
  try {
    const tutors = await TutorService.getAllTutors();
    res.status(200).json({
      success: true,
      message: 'Tutors retrieved successfully',
      data: tutors,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tutors',
      error: error.message,
    });
  }
};

export const TutorController = {
  getAllTutors,
};
