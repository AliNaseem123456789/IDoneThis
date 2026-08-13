import express from "express";
import { getTasks, addTask, updateTask, deleteTask,getTasks_v1 } from "../controllers/taskController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getTasks);
router.get("/v1", authenticate, getTasks_v1);
router.post("/", authenticate, addTask);
router.put("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);

export default router;
