import express from "express";
import { getTasks, addTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getTasks);
router.post("/", authenticate, addTask);
router.put("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);

export default router;
