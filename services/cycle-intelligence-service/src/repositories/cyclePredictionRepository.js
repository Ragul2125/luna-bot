import prisma from '../../../../shared/prisma/prisma.client.js';

export const createCycleLog = async (userId, data) => {
  return prisma.cycleLog.create({
    data: {
      userId,
      periodStart: new Date(data.periodStart),
      periodEnd: data.periodEnd ? new Date(data.periodEnd) : null,
      cycleLength: data.cycleLength,
    }
  });
};

export const createCyclePrediction = async (userId, data) => {
  return prisma.cyclePrediction.create({
    data: {
      cycleLogId: data.cycleLogId,
      predictedPeriodStart: data.predictedPeriodStart,
      predictedPeriodEnd: data.predictedPeriodEnd,
      ovulationDate: data.ovulationDate,
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
      predictedPeriodStart: 'asc',
    },
  });
};