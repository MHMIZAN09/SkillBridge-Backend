import { Request, Response } from 'express';
import { TutorService } from './tutor.service';
import paginationSortingHelper from '../../utills/paginationHelper';

const getAllTutors = async (req: Request, res: Response) => {
  // Logic to retrieve all tutors from the database
  try {
    const filters = {
      search: req.query.search ? (req.query.search as string) : null,
      hourlyRate: req.query.hourlyRate ? Number(req.query.hourlyRate) : null,
      categoryId: req.query.categoryId
        ? (req.query.categoryId as string)
        : null,
      avgRating: req.query.avgRating ? Number(req.query.avgRating) : null,
      totalReviews: req.query.totalReviews
        ? Number(req.query.totalReviews)
        : null,
    };
    const paginationOptions = paginationSortingHelper(req.query);
    const tutors = await TutorService.getAllTutors({
      ...filters,
      ...paginationOptions,
    });
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
