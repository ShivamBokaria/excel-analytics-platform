import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get pending admins
router.get("/pending-admins", protect, adminOnly, async (req, res) => {
  const pending = await User.find({ role: "admin", status: "pending" }).select("-password");
  res.json(pending);
});

// Approve admin by ID
router.put("/approve/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ message: "Admin approved" });
});

export default router;
