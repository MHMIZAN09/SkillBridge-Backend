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
  // Logic to fetch all tutors from the database

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

export const TutorService = {
  getAllTutors,
};
