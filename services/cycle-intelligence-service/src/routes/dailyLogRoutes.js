import express from "express";
import {
  saveDailyLogController,
  getUserDailyLogsController,
  getUserDailyLogByDateController,
} from "../controllers/dailyLogController.js";

const router = express.Router();

router.post("/", saveDailyLogController);
router.get("/user/:userId", getUserDailyLogsController);
router.get("/user/:userId/date/:date", getUserDailyLogByDateController);

export default router;
