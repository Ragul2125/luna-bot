import prisma from '../../../../shared/prisma/prisma.client.js';

export const createCyclePrediction = async (userId, data) => {
  return prisma.cyclePrediction.create({
    data: {
      predictedPeriodStart: data.predictedPeriodStart,
      predictedPeriodEnd: data.predictedPeriodEnd,
      ovulationDate: data.ovulationDate,
      cycleLog: {
        create: {
          userId: userId,
          periodStart: data.periodStart,
          periodEnd: data.periodEnd,
          cycleLength: data.cycleLength,
        }
      }
    },
  });
};

export const getCycleByUserId = async (userId) => {
  return prisma.cyclePrediction.findMany({
    where: {
      cycleLog: {
        userId: userId,
      },
    },
    include: {
      cycleLog: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};