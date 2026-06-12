import { upsertSleepLog, getSleepLogsByUserId, getSleepLogByDate } from "../repositories/sleepLogRepository.js";
import { linkSleepLogToDailyLog } from "../repositories/dailyLogRepository.js";

export const saveSleepLog = async (userId, sleepDate, sleepHours) => {
  const hours = parseFloat(sleepHours);
  if (isNaN(hours) || hours < 0 || hours > 24) {
    throw new Error("Invalid sleep hours. Must be a number between 0 and 24.");
  }

  const dateStr = new Date(sleepDate).toISOString().split("T")[0];

  const sleepLog = await upsertSleepLog(userId, dateStr, hours);

  // Link sleep log to any existing daily log for that day
  await linkSleepLogToDailyLog(userId, dateStr, sleepLog.id);

  return sleepLog;
};

export const getUserSleepLogs = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }
  return getSleepLogsByUserId(userId);
};

export const getUserSleepLogByDate = async (userId, date) => {
  if (!userId || !date) {
    throw new Error("User ID and date are required.");
  }
  const dateStr = new Date(date).toISOString().split("T")[0];
  return getSleepLogByDate(userId, dateStr);
};
