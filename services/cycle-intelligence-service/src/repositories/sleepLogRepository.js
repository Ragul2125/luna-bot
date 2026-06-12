import prisma from "../../../../shared/prisma/prisma.client.js";

export const upsertSleepLog = async (userId, sleepDate, sleepHours) => {
  const dateObj = new Date(sleepDate);
  return prisma.sleepLog.upsert({
    where: {
      userId_sleepDate: {
        userId,
        sleepDate: dateObj,
      },
    },
    update: {
      sleepHours,
      recordedAt: new Date(),
    },
    create: {
      userId,
      sleepDate: dateObj,
      sleepHours,
    },
  });
};

export const getSleepLogByDate = async (userId, sleepDate) => {
  const dateObj = new Date(sleepDate);
  return prisma.sleepLog.findUnique({
    where: {
      userId_sleepDate: {
        userId,
        sleepDate: dateObj,
      },
    },
  });
};

export const getSleepLogsByUserId = async (userId) => {
  return prisma.sleepLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      sleepDate: "desc",
    },
  });
};
