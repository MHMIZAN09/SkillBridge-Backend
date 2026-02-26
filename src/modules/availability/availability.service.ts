import {
  AvailabilityStatus,
  DayOfWeek,
  Prisma,
} from '../../../generated/prisma/client';
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
          startTime: { lt: endTime },
          endTime: { gt: startTime },
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
};

const getAvailabilitiesByTutor = async (tutorId: string) => {
  return await prisma.availability.findMany({
    where: { tutorId },
    orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
  });
};

const updateAvailability = async (
  availabilityId: string,
  data: Prisma.AvailabilityUpdateInput,
  tutorId: string,
) => {
  const existing = await prisma.availability.findFirst({
    where: { id: availabilityId, tutorId },
  });

  if (!existing) {
    throw new Error('Availability slot not found for the tutor');
  }
  if (existing.status !== AvailabilityStatus.AVAILABLE) {
    throw new Error('Cannot update an unavailable availability slot');
  }

  const day = (data.day as DayOfWeek) ?? existing.day;
  const startTime = (data.startTime as Date) ?? existing.startTime;
  const endTime = (data.endTime as Date) ?? existing.endTime;

  if (endTime <= startTime) {
    throw new Error('Start time must be before end time');
  }

  const conflict = await prisma.availability.findFirst({
    where: {
      tutorId,
      day,
      status: AvailabilityStatus.AVAILABLE,
      NOT: { id: availabilityId },
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  });

  if (conflict) {
    throw new Error(
      'The updated time slot conflicts with an existing availability',
    );
  }

  return prisma.availability.update({
    where: { id: availabilityId },
    data: { day, startTime, endTime },
  });
};

const deleteAvailability = async (availabilityId: string, tutorId: string) => {
  const existing = await prisma.availability.findUnique({
    where: { id: availabilityId },
  });

  if (!existing) {
    throw new Error('Availability not found');
  }

  if (existing.tutorId !== tutorId) {
    throw new Error('Not authorized to delete this availability');
  }

  if (existing.status === AvailabilityStatus.BOOKED) {
    throw new Error('Cannot delete a booked availability');
  }

  return prisma.availability.delete({
    where: { id: availabilityId },
  });
};

export const availabilityService = {
  createAvailability,
  getAvailabilitiesByTutor,
  updateAvailability,
  deleteAvailability,
};
