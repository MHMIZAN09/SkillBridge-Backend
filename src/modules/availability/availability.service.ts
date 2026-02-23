import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createAvailability = async (
  data: Prisma.AvailabilityCreateInput,
  userId: string,
) => {
  const { day, endTime, startTime } = data;
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutor) {
    throw new Error('Tutor profile not found for the user');
  }

  if (startTime >= endTime) {
    throw new Error('Start time must be before end time');
  }

  const conflictingSlot = await prisma.availability.findFirst({
    where: {
      tutorId: tutor.id,
      day,
      OR: [
        {
          startTime: {
            lt: endTime,
          },
          endTime: {
            gt: startTime,
          },
        },
      ],
    },
  });

  if (conflictingSlot) {
    throw new Error(
      'The specified time slot conflicts with an existing availability',
    );
  }

  const availability = await prisma.availability.create({
    data: {
      day,
      startTime,
      endTime,
      tutor: {
        connect: { id: tutor.id },
      },
    },
  });

  return availability;

  console.log(tutor, day, startTime, endTime);
};

export const availabilityService = { createAvailability };
