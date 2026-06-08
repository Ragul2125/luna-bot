import { createUserController, getUserController, getUserOnboardingStatusController } from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.post("/", createUserController);
router.get("/:whatsappNumber", getUserController);
router.get("/:whatsappNumber/onboarded", getUserOnboardingStatusController);
export default router;