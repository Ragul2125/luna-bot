import prisma from "../../../../shared/prisma/prisma.client.js";

export const getDailyLogByDate = async (userId, logDate) => {
  const targetDate = new Date(logDate);
  return prisma.dailyLog.findFirst({
    where: {
      userId,
      logDate: targetDate,
    },
    include: {
      phase: true,
      sleepLog: true,
    },
  });
};

export const createDailyLog = async (data) => {
  return prisma.dailyLog.create({
    data: {
      userId: data.userId,
      phaseId: data.phaseId,
      sleepLogId: data.sleepLogId || null,
      logDate: new Date(data.logDate),
      recommendationSent: data.recommendationSent || null,
    },
    include: {
      phase: true,
      sleepLog: true,
    },
  });
};

export const updateDailyLog = async (id, data) => {
  return prisma.dailyLog.update({
    where: {
      id,
    },
    data: {
      phaseId: data.phaseId,
      sleepLogId: data.sleepLogId !== undefined ? data.sleepLogId : undefined,
      recommendationSent: data.recommendationSent !== undefined ? data.recommendationSent : undefined,
    },
    include: {
      phase: true,
      sleepLog: true,
    },
  });
};

export const getDailyLogsByUserId = async (userId) => {
  return prisma.dailyLog.findMany({
    where: {
      userId,
    },
    include: {
      phase: true,
      sleepLog: true,
    },
    orderBy: {
      logDate: "desc",
    },
  });
};

export const linkSleepLogToDailyLog = async (userId, logDate, sleepLogId) => {
  const targetDate = new Date(logDate);
  const dailyLog = await prisma.dailyLog.findFirst({
    where: {
      userId,
      logDate: targetDate,
    },
  });

  if (dailyLog) {
    return prisma.dailyLog.update({
      where: {
        id: dailyLog.id,
      },
      data: {
        sleepLogId,
      },
    });
  }
  return null;
};
