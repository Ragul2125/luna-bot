import { getCyclePhasesService } from "./phasesIntelligenceService.js";
import { getSleepLogByDate } from "../repositories/sleepLogRepository.js";
import {
  getDailyLogByDate,
  createDailyLog,
  updateDailyLog,
  getDailyLogsByUserId,
} from "../repositories/dailyLogRepository.js";

export const saveDailyLog = async (
  userId,
  logDate,
  recommendationSent
) => {
  if (!userId || !logDate) {
    throw new Error("userId and logDate are required.");
  }

  const dateStr = new Date(logDate).toISOString().split("T")[0];

  // 1. Get the cycle phase covering this date
  let phase;
  try {
    phase = await getCyclePhasesService(userId, dateStr);
  } catch (err) {
    throw new Error(
      `Failed to find cycle phase for date ${dateStr}: ${err.message}. Please generate cycle predictions first.`
    );
  }

  if (!phase || !phase.id) {
    throw new Error(
      `No cycle phase found for date ${dateStr}. Please generate your cycle predictions.`
    );
  }

  // 2. Try to find if a sleep log exists for this date
  const sleepLog = await getSleepLogByDate(userId, dateStr);
  const sleepLogId = sleepLog ? sleepLog.id : null;

  // 3. Check if DailyLog already exists
  const existingLog = await getDailyLogByDate(userId, dateStr);

  const logData = {
    userId,
    phaseId: phase.id,
    sleepLogId,
    logDate: dateStr,
    recommendationSent: recommendationSent || null,
  };

  if (existingLog) {
    return updateDailyLog(existingLog.id, logData);
  } else {
    return createDailyLog(logData);
  }
};

export const getUserDailyLogs = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }
  return getDailyLogsByUserId(userId);
};

export const getUserDailyLogByDate = async (userId, date) => {
  if (!userId || !date) {
    throw new Error("User ID and date are required.");
  }
  const dateStr = new Date(date).toISOString().split("T")[0];
  return getDailyLogByDate(userId, dateStr);
};
