import express from "express";
import {
  saveSleepLogController,
  getUserSleepLogsController,
  getUserSleepLogByDateController,
} from "../controllers/sleepLogController.js";

const router = express.Router();

router.post("/", saveSleepLogController);
router.get("/user/:userId", getUserSleepLogsController);
router.get("/user/:userId/date/:date", getUserSleepLogByDateController);

export default router;
