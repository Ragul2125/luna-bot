import {
  saveSleepLog,
  getUserSleepLogs,
  getUserSleepLogByDate,
} from "../services/sleepLogService.js";

export const saveSleepLogController = async (req, res) => {
  try {
    const { userId, sleepDate, sleepHours } = req.body;

    if (!userId || !sleepDate || sleepHours === undefined) {
      return res.status(400).json({
        error: "userId, sleepDate, and sleepHours are required",
      });
    }

    const result = await saveSleepLog(userId, sleepDate, sleepHours);

    return res.status(200).json({
      message: "Sleep log saved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getUserSleepLogsController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const result = await getUserSleepLogs(userId);

    return res.status(200).json({
      message: "Sleep logs retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getUserSleepLogByDateController = async (req, res) => {
  try {
    const { userId, date } = req.params;

    if (!userId || !date) {
      return res.status(400).json({
        error: "userId and date parameters are required",
      });
    }

    const result = await getUserSleepLogByDate(userId, date);

    if (!result) {
      return res.status(404).json({
        error: "Sleep log not found for the specified date",
      });
    }

    return res.status(200).json({
      message: "Sleep log retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
