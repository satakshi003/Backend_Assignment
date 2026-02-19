import express from "express";
import {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", verifyJWT, createTask);

router.get("/", verifyJWT, getUserTasks);

router.put("/:taskId", verifyJWT, updateTask);

router.delete("/:taskId", verifyJWT, deleteTask);

export default router;