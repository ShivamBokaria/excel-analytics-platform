import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Dataset from "../models/Dataset.js";
import Report from "../models/Report.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// Get pending admins (ensure includes essential fields)
router.get("/pending-admins", protect, adminOnly, async (req, res) => {
  const pending = await User.find({ role: "admin", status: "pending" }).select("_id name email role status createdAt");
  res.json(pending);
});

// Approve admin by ID
router.put("/approve/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ message: "Admin approved" });
});

// Stats for admin dashboard
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [users, datasets, reports] = await Promise.all([
      User.countDocuments({}),
      Dataset.countDocuments({}),
      Report.countDocuments({}),
    ]);
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    const onlineAgg = await Activity.aggregate([
      { $match: { createdAt: { $gte: tenMinAgo } } },
      { $group: { _id: "$user" } },
      { $count: "count" }
    ]);
    const online = onlineAgg[0]?.count || 0;
    res.json({ users, datasets, reports, online });
  } catch (e) {
    res.status(500).json({ message: "Failed to load stats" });
  }
});

// User management (admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find({}).select('_id name email role status createdAt').sort({ createdAt: -1 });
  res.json(users);
});

router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  const { role } = req.body; // 'user' or 'admin'
  if (!['user','admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: 'updated' });
});

router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
});

// Admin endpoint to view user datasets
router.get('/users/:userId/datasets', protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const datasets = await Dataset.find({ owner: userId })
      .sort({ createdAt: -1 })
      .select("originalName columns rowCount createdAt fileSize");

    res.json({ user, datasets });
  } catch (error) {
    console.error('Error fetching user datasets:', error);
    res.status(500).json({ message: 'Failed to fetch user datasets' });
  }
});

// Admin endpoint to view specific user dataset details
router.get('/users/:userId/datasets/:datasetId', protect, adminOnly, async (req, res) => {
  try {
    const { userId, datasetId } = req.params;
    const user = await User.findById(userId).select('name email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const dataset = await Dataset.findOne({ _id: datasetId, owner: userId });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    res.json({ user, dataset });
  } catch (error) {
    console.error('Error fetching user dataset:', error);
    res.status(500).json({ message: 'Failed to fetch user dataset' });
  }
});

// Admin endpoint to view user reports
router.get('/users/:userId/reports', protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('name email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const reports = await Report.find({ owner: userId })
      .sort({ createdAt: -1 })
      .select("name chartType xCol yCol zCol dimension createdAt");

    res.json({ user, reports });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ message: 'Failed to fetch user reports' });
  }
});

export default router;
