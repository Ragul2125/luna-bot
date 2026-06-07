import express from "express";
import { getCyclePhasesController } from "../controllers/phasesIntelligenceController.js";

const router = express.Router();

router.get("/", getCyclePhasesController);

export default router;