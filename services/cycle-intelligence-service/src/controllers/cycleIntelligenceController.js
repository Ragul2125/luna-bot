import { logPeriodAndPredictService } from "../services/cycleIntelligenceService.js";

export const logPeriodController = async (req, res) => {
  try {
    const {
      userId,
      lastPeriodStartDate,
      lastPeriodEndDate,
      cycleLength,
    } = req.body;

    // ✅ validation
    if (!userId || !lastPeriodStartDate || !lastPeriodEndDate || !cycleLength) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const start = new Date(lastPeriodStartDate);
    const end = new Date(lastPeriodEndDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        error: "Invalid date format",
      });
    }

    if (start >= end) {
      return res.status(400).json({
        error: "Start date must be before end date",
      });
    }

    const length = parseInt(cycleLength, 10);
    if (isNaN(length) || length < 21 || length > 45) {
      return res.status(400).json({
        error: "Cycle length must be between 21–45",
      });
    }

    // ✅ service call
    const result = await logPeriodAndPredictService(
      userId,
      lastPeriodStartDate,
      lastPeriodEndDate,
      length
    );

    return res.status(200).json({
      message: "Period logged and cycles predicted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

