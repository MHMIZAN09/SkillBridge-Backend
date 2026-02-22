import { prisma } from '../../lib/prisma';

const getAllTutors = async () => {
  // Logic to fetch all tutors from the database
  const tutors = await prisma.tutorProfile.findMany();
  return tutors;
};

export const TutorService = {
  getAllTutors,
};
