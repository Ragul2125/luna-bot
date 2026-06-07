import { getCycleByUserId } from "../repositories/cyclePredictionRepository.js";
import { getCyclePhasesByCycleId } from "../repositories/cyclePhaseRepository.js";
export const getCyclePhasesService = async (userId, targetDate) => {
    try {
        const cycles = await getCycleByUserId(userId);
        if (!cycles || cycles.length === 0) {
            throw new Error("Cycle not found");
        }

        const date = new Date(targetDate);

        // Find the cycle prediction whose full cycle duration covers the target date
        for (const cycle of cycles) {
            const cycleStart = new Date(cycle.predictedPeriodStart);
            const cycleEnd = new Date(cycleStart);
            const length = cycle.cycleLog?.cycleLength || 28;
            cycleEnd.setDate(cycleEnd.getDate() + length);

            if (cycleStart <= date && cycleEnd >= date) {
                const phases = await getCyclePhasesByCycleId(cycle.id);
                
                // Find the specific phase that covers the target date
                for (const phase of phases) {
                    const start = new Date(phase.phaseStart);
                    const end = new Date(phase.phaseEnd);
                    if (start <= date && end >= date) {
                        return phase;
                    }
                }
            }
        }

        // Fallback to the latest cycle prediction's first phase
        const latestCycle = cycles[cycles.length - 1];
        const phases = await getCyclePhasesByCycleId(latestCycle.id);
        if (phases && phases.length > 0) {
            return phases[0];
        }
        
        throw new Error("Phases not found");
    } catch (error) {
        throw error;
    }
};