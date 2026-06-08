import { createCyclePrediction, createCycleLog } from "../repositories/cyclePredictionRepository.js";
import { createCyclePhases } from "../repositories/cyclePhaseRepository.js";
import { updateUserOnboarded } from "../repositories/userRepository.js";

export const logPeriodAndPredictService = async (
  userId,
  lastPeriodStartDate,
  lastPeriodEndDate,
  cycleLength
) => {
  try {
    // 1. Create actual user-reported CycleLog
    const actualLog = await createCycleLog(userId, {
      periodStart: lastPeriodStartDate,
      periodEnd: lastPeriodEndDate,
      cycleLength
    });

    // 2. Mark the user as onboarded
    await updateUserOnboarded(userId, true);

    const results = [];
    let currentStartDate = new Date(lastPeriodStartDate);
    const periodDuration =
      (new Date(lastPeriodEndDate) - new Date(lastPeriodStartDate)) /
      (1000 * 60 * 60 * 24);

    for (let i = 0; i <= 3; i++) {
      let nextStart;
      if (i === 0) {
        nextStart = new Date(currentStartDate);
      } else {
        nextStart = new Date(currentStartDate);
        nextStart.setDate(nextStart.getDate() + cycleLength);
      }

      const nextEnd = new Date(nextStart);
      nextEnd.setDate(nextEnd.getDate() + periodDuration);

      const subsequentStart = new Date(nextStart);
      subsequentStart.setDate(subsequentStart.getDate() + cycleLength);
      
      const ovulation = new Date(subsequentStart);
      ovulation.setDate(ovulation.getDate() - 14);

      // Follicular phase starts the day after Menstrual ends
      const follicularStart = new Date(nextEnd);
      follicularStart.setDate(follicularStart.getDate() + 1);

      // Follicular phase ends the day before Ovulation
      const follicularEnd = new Date(ovulation);
      follicularEnd.setDate(follicularEnd.getDate() - 1);

      // Guard in case follicularEnd is before follicularStart (extreme cycle/period lengths)
      if (follicularEnd < follicularStart) {
        follicularStart.setTime(follicularEnd.getTime());
      }

      // Luteal phase starts the day after Ovulation
      const lutealStart = new Date(ovulation);
      lutealStart.setDate(lutealStart.getDate() + 1);

      // Luteal phase ends the day before subsequent cycle starts
      const lutealEnd = new Date(subsequentStart);
      lutealEnd.setDate(lutealEnd.getDate() - 1);

      const phases = [
        {
          type: "MENSTRUAL",
          start: nextStart,
          end: nextEnd,
        },
        {
          type: "FOLLICULAR",
          start: follicularStart,
          end: follicularEnd,
        },
        {
          type: "OVULATION",
          start: ovulation,
          end: ovulation,
        },
        {
          type: "LUTEAL",
          start: lutealStart,
          end: lutealEnd,
        },
      ];

      const cycle = await createCyclePrediction(userId, {
        cycleLogId: actualLog.id,
        predictedPeriodStart: nextStart,
        predictedPeriodEnd: nextEnd,
        ovulationDate: ovulation,
      });

      await createCyclePhases(cycle.id, phases);
      
      results.push({
        cycle,
        phases,
      });

      currentStartDate = nextStart;
    }

    return {
      actualLog,
      predictions: results
    };
  } catch (error) {
    throw error;
  }
};