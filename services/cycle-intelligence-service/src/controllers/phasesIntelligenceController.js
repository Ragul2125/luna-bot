import { getCyclePhasesService } from "../services/phasesIntelligenceService.js";

export const getCyclePhasesController = async (req, res) => {
  try {
    const { userId, date } = req.body;

    // ✅ validation
    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];

    // ✅ service call
    const result = await getCyclePhasesService(userId, targetDate);

    return res.status(200).json({
      message: "Current cycle phase retrieved successfully",
      data: {
        date: targetDate,
        currentPhase: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};