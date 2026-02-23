import {
  TutorProfile,
  User,
  UserRoles,
} from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

type FilterItems = {
  search: string | null;
  hourlyRate: number | null;
  categoryId: string | null;
  avgRating: number | null;
  totalReviews: number | null;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const getAllTutors = async ({
  search,
  hourlyRate,
  categoryId,
  avgRating,
  totalReviews,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: FilterItems) => {
  const andConditions: any[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          bio: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    });
  }
  if (hourlyRate) {
    andConditions.push({
      hourlyRate: {
        lte: hourlyRate,
      },
    });
  }

  if (categoryId) {
    andConditions.push({
      categoryId: categoryId,
    });
  }

  if (avgRating) {
    andConditions.push({
      avgRating: {
        gte: avgRating,
      },
    });
  }

  if (totalReviews) {
    andConditions.push({
      totalReviews: {
        gte: totalReviews,
      },
    });
  }

  const tutors = await prisma.tutorProfile.findMany({
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: {
      AND: andConditions,
    },
    include: {
      user: true,
      category: true,
    },
  });
  const total = await prisma.tutorProfile.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    tutors,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getTutorById = async (tutorId: string) => {
  return await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
    },
    include: {
      user: true,
      category: true,
      availability: true,
      reviews: true,
    },
  });
};

const updateTutor = async (data: Partial<TutorProfile>, user: User) => {
  if (user.role !== UserRoles.ADMIN) {
    delete data.isFeatured;
    delete data.avgRating;
    delete data.totalReviews;
  }

  return await prisma.tutorProfile.update({
    where: {
      userId: user.id,
    },
    data,
  });
};

const updateTutorSubjects = async (subjectIds: string[], user: User) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!tutorProfile) {
    throw new Error('Tutor profile not found');
  }

  if (!tutorProfile.categoryId) {
    throw new Error('Tutor profile category not found');
  }

  const subjects = await prisma.subject.findMany({
    where: {
      id: { in: subjectIds },
    },
    select: {
      id: true,
      categoryId: true,
    },
  });

  if (subjects.length !== subjectIds.length) {
    throw new Error('One or more subjects are invalid');
  }

  const invalidSubject = subjects.find(
    (s) => s.categoryId !== tutorProfile.categoryId,
  );

  if (invalidSubject) {
    throw new Error('You selected a subject outside your category');
  }

  return await prisma.$transaction(async (tx) => {
    await tx.tutorSubject.deleteMany({
      where: {
        tutorId: tutorProfile.id,
      },
    });

    const data = subjectIds.map((subjectId) => ({
      tutorId: tutorProfile.id,
      subjectId,
    }));

    return await tx.tutorSubject.createManyAndReturn({
      data,
    });
  });
};

const deleteTutorSubject = async (subjectId: string, user: User) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: user.id },
  });

  if (!tutorProfile) {
    throw new Error('Tutor not found');
  }

  return await prisma.tutorSubject.delete({
    where: {
      tutorId_subjectId: {
        tutorId: tutorProfile.id,
        subjectId: subjectId,
      },
    },
  });
};

export const TutorService = {
  getAllTutors,
  getTutorById,
  updateTutor,
  updateTutorSubjects,
  deleteTutorSubject,
};
