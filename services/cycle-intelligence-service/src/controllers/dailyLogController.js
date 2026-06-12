import {
  saveDailyLog,
  getUserDailyLogs,
  getUserDailyLogByDate,
} from "../services/dailyLogService.js";

export const saveDailyLogController = async (req, res) => {
  try {
    const {
      userId,
      logDate,
      recommendationSent,
    } = req.body;

    if (!userId || !logDate) {
      return res.status(400).json({
        error: "userId and logDate are required",
      });
    }

    const result = await saveDailyLog(
      userId,
      logDate,
      recommendationSent
    );

    return res.status(200).json({
      message: "Daily log saved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getUserDailyLogsController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const result = await getUserDailyLogs(userId);

    return res.status(200).json({
      message: "Daily logs retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getUserDailyLogByDateController = async (req, res) => {
  try {
    const { userId, date } = req.params;

    if (!userId || !date) {
      return res.status(400).json({
        error: "userId and date parameters are required",
      });
    }

    const result = await getUserDailyLogByDate(userId, date);

    if (!result) {
      return res.status(404).json({
        error: "Daily log not found for the specified date",
      });
    }

    return res.status(200).json({
      message: "Daily log retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
