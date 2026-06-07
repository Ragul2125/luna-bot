import express from "express";
import { predictCycleController } from "../controllers/cycleIntelligenceController.js";
const router = express.Router();

router.post("/predict-cycle", predictCycleController);

export default router;