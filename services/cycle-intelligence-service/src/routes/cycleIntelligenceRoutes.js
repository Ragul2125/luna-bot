import express from "express";
import { logPeriodController } from "../controllers/cycleIntelligenceController.js";
const router = express.Router();

router.post("/log-period", logPeriodController);

export default router;