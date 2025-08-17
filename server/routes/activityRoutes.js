import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// Log an activity (internal use if needed)
router.post('/', protect, async (req, res) => {
  const { type, action, details } = req.body;
  const a = await Activity.create({ user: req.userId, type, action, details });
  res.status(201).json(a);
});

// Current user activities
router.get('/me', protect, async (req, res) => {
  const list = await Activity.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50);
  res.json(list);
});

// Admin can view activities by user
router.get('/user/:id', protect, adminOnly, async (req, res) => {
  const list = await Activity.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(200);
  res.json(list);
});

export default router;


