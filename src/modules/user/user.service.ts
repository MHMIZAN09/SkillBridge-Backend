import {
  UserRoles,
  UserStatus,
  type User,
} from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

type PaginationInput = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

const listUsers = async ({
  page,
  limit,
  sortBy,
  skip,
  sortOrder,
}: PaginationInput) => {
  const total = await prisma.user.count(); // fix: was counting tutorProfile not users

  const result = await prisma.user.findMany({
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUser = async (user: User) => {
  return await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      bookings: user.role === UserRoles.STUDENT, // fix: was studentBookings
      reviews: user.role === UserRoles.STUDENT, // fix: was studentReviews
      tutorProfile: user.role === UserRoles.TUTOR,
    },
  });
};

const updateUserData = async (
  data: Partial<User> & { phone?: string },
  user: User,
) => {
  const { name, email, phone } = data;

  if (!name && !email && !phone) {
    throw new Error('At least one field must be provided for update');
  }

  const userExists = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
  });

  return await prisma.user.update({
    where: { id: userExists.id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      phone: true,
    },
  });
};

const updateUserStatus = async (status: UserStatus, userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
};

export const UserService = {
  getUser,
  updateUserStatus,
  listUsers,
  updateUserData,
};
