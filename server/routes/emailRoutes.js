// routes/emailRoutes.js
import express from "express";
import {
  sendReminder,             
  createOrUpdateReminder,   
  getUserReminders,        
  toggleReminderActive,      
} from "../controllers/emailController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.post("/send-reminder", authenticate, sendReminder);
router.post("/set-reminder", authenticate, createOrUpdateReminder);
router.get("/my-reminders", authenticate, getUserReminders);
router.put("/toggle-reminder/:id", authenticate, toggleReminderActive);

export default router;