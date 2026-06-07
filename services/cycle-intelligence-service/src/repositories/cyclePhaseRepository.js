import prisma from '../../../../shared/prisma/prisma.client.js';

export const createCyclePhases = async (predictionId, phases) => {
  return prisma.cyclePhase.createMany({
    data: phases.map((p) => ({
      predictionId: predictionId,
      phaseType: p.type,
      phaseStart: p.start,
      phaseEnd: p.end,
    })),
  });
};

export const getCyclePhasesByCycleId = async (predictionId) => {
  return prisma.cyclePhase.findMany({
    where: {
      predictionId: predictionId,
    },
  });
};