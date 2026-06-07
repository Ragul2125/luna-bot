import { createCyclePrediction } from "../repositories/cyclePredictionRepository.js";
import { createCyclePhases } from "../repositories/cyclePhaseRepository.js";

export const predictCycleWithPhasesService = async (
  userId,
  lastPeriodStartDate,
  lastPeriodEndDate,
  cycleLength
) => {
  try {
    const results = [];

    let currentStartDate = new Date(lastPeriodStartDate);

    const periodDuration =
      (new Date(lastPeriodEndDate) - new Date(lastPeriodStartDate)) /
      (1000 * 60 * 60 * 24);

    for (let i = 0; i <= 3; i++) {
      // ✅ determine next start date and preceding log start date
      let nextStart;
      let prevStartDate;
      
      if (i === 0) {
        nextStart = new Date(currentStartDate);
        prevStartDate = new Date(currentStartDate);
        prevStartDate.setDate(prevStartDate.getDate() - cycleLength);
      } else {
        nextStart = new Date(currentStartDate);
        nextStart.setDate(nextStart.getDate() + cycleLength);
        prevStartDate = new Date(currentStartDate);
      }

      const nextEnd = new Date(nextStart);
      nextEnd.setDate(nextEnd.getDate() + periodDuration);

      // ✅ ovulation (occurs 14 days before the next subsequent period starts)
      const subsequentStart = new Date(nextStart);
      subsequentStart.setDate(subsequentStart.getDate() + cycleLength);
      
      const ovulation = new Date(subsequentStart);
      ovulation.setDate(ovulation.getDate() - 14);

      // ✅ phases
      const phases = [
        {
          type: "MENSTRUAL",
          start: nextStart,
          end: nextEnd,
        },
        {
          type: "FOLLICULAR",
          start: nextEnd,
          end: ovulation,
        },
        {
          type: "OVULATION",
          start: ovulation,
          end: ovulation,
        },
        {
          type: "LUTEAL",
          start: new Date(ovulation.getTime() + 86400000),
          end: subsequentStart,
        },
      ];

      // ✅ store cycle
      const prevEndDate = new Date(prevStartDate.getTime() + periodDuration * 86400000);
      const cycle = await createCyclePrediction(userId, {
        predictedPeriodStart: nextStart,
        predictedPeriodEnd: nextEnd,
        ovulationDate: ovulation,
        periodStart: prevStartDate,
        periodEnd: prevEndDate,
        cycleLength: cycleLength,
      });

      // ✅ store phases
      await createCyclePhases(cycle.id, phases);
      
      results.push({
        cycle,
        phases,
      });

      currentStartDate = nextStart;
    }

    return results;
  } catch (error) {
    throw error;
  }
};