import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js"; // assumes you have auth middleware

const router = express.Router();

// POST /api/tasks - create task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      owner: req.user.id
    });

    res.status(201).json(task); // ✅ return the task directly
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ success: false, message: "Error creating task" });
  }
});

// GET /api/tasks - get all tasks for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id });
    res.status(200).json(tasks); // ✅ return array of tasks
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ success: false, message: "Error fetching tasks" });
  }
});

export default router;