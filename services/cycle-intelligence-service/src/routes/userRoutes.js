import { createUserController, getUserController } from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.post("/", createUserController);
router.get("/:whatsappNumber", getUserController);
export default router;