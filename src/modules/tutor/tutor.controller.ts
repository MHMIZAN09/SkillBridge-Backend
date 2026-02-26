import type { NextFunction, Request, Response } from 'express';
import { TutorService } from './tutor.service';

import type { TutorSubject, User } from '../../../generated/prisma/client';
import paginationSortingHelper from '../../utills/paginationHelper';

const getAllTutors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filters = {
      search: req.query.search ? (req.query.search as string) : null,
      hourlyRate: req.query.hourlyRate
        ? (Number(req.query.hourlyRate) as number)
        : null,
      categoryId: req.query.categoryId
        ? (req.query.categoryId as string)
        : null,
      isFeatured: req.query.isFeatured
        ? req.query.isFeatured === 'true'
          ? true
          : req.query.isFeatured === 'false'
            ? false
            : null
        : null,
      avgRating: req.query.avgRating
        ? (Number(req.query.avgRating) as number)
        : null,
      totalReviews: req.query.totalReviews
        ? (Number(req.query.totalReviews) as number)
        : null,
      subjectId: req.query.subjectId ? (req.query.subjectId as string) : null,
    };

    const pagination = paginationSortingHelper(req.query);

    const result = await TutorService.getAllTutors({
      ...filters,
      ...pagination,
    });
    return res.status(200).json({
      success: true,
      message: 'Tutors data retrieved successfully',
      data: result.tutors,
      pagination: result.pagination,
    });
  } catch (e) {
    next(e);
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const result = await TutorService.getTutorById(req.params.Id as string);

    if (result === null) {
      return res
        .status(400)
        .json({ success: false, message: 'Tutor not found', data: null });
    }

    return res.status(200).json({
      success: true,
      message: 'Tutor data retrieved successfully',
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving tutor data',
      error: e,
    });
  }
};

const updateTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TutorService.updateTutor(req.body, req.user as User);

    return res.status(200).json({
      success: true,
      message: 'Tutors data updated successfully',
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const updateTutorSubjects = async (req: Request, res: Response) => {
  try {
    const { subjectIds } = req.body;

    if (
      !Array.isArray(subjectIds) ||
      subjectIds.length === 0 ||
      !subjectIds.every((id: unknown) => typeof id === 'string')
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid format. Expected: subjectIds: ['id1', 'id2']",
      });
    }

    const result = await TutorService.updateTutorSubjects(
      subjectIds,
      req.user as User,
    );

    return res.status(200).json({
      success: true,
      message: 'Subjects updated successfully',
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Error updating subjects',
      error: e instanceof Error ? e.message : e,
    });
  }
};

const deleteTutorSubject = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;

    if (!subjectId || typeof subjectId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'subjectId is required',
      });
    }

    const result = await TutorService.deleteTutorSubject(
      subjectId,
      req.user as User,
    );

    return res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting subject',
      error: e instanceof Error ? e.message : e,
    });
  }
};

const featureTutor = async (req: Request, res: Response) => {
  try {
    if (Object.keys(req.body).some((key) => key !== 'isFeatured')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid field input. Only isFeatured is allowed.',
      });
    }
    const result = await TutorService.featureTutor(
      req.params.tutorId as string,
      req.body.isFeatured,
    );

    return res.status(200).json({
      success: true,
      message: 'Tutor featured status updated',
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Error featuring tutor',
      error: e instanceof Error ? e.message : e,
    });
  }
};

const getTutorDashboardOverview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TutorService.getTutorDashboardOverview(
      req.user as User,
    );

    return res.status(200).json({
      success: true,
      message: 'Retrieved tutors overview successfully',
      data: result,
    });
  } catch (e: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving tutors overview',
    });
  }
};

export const TutorController = {
  getAllTutors,
  getTutorById,
  updateTutor,
  updateTutorSubjects,
  deleteTutorSubject,
  featureTutor,
  getTutorDashboardOverview,
};
