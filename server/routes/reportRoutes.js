import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Report from "../models/Report.js";

const router = express.Router();

// Create report
router.post("/", protect, async (req, res) => {
  try {
    const { dataset, name, chartType, xCol, yCol, options } = req.body;
    const report = await Report.create({ owner: req.userId, dataset, name, chartType, xCol, yCol, options });
    res.status(201).json(report);
  } catch (e) {
    res.status(400).json({ message: "Failed to save report" });
  }
});

// List my reports
router.get("/", protect, async (req, res) => {
  const reports = await Report.find({ owner: req.userId }).sort({ createdAt: -1 });
  res.json(reports);
});

// Get one
router.get("/:id", protect, async (req, res) => {
  const report = await Report.findOne({ _id: req.params.id, owner: req.userId });
  if (!report) return res.status(404).json({ message: "Not found" });
  res.json(report);
});

// Delete
router.delete("/:id", protect, async (req, res) => {
  await Report.deleteOne({ _id: req.params.id, owner: req.userId });
  res.json({ message: 'deleted' });
});

export default router;


