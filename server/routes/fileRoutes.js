import express from "express";
import multer from "multer";
import * as XLSX from "xlsx";
import { protect } from "../middleware/authMiddleware.js";
import Dataset from "../models/Dataset.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// Use memory storage; we parse then discard the buffer. Limit to ~10MB.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/files/upload - upload and parse an Excel file
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Parse workbook
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return res.status(400).json({ message: "No sheet found in workbook" });

    // Get rows as arrays to determine columns reliably
    const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    if (matrix.length === 0) return res.status(400).json({ message: "Sheet is empty" });

    const headerRow = matrix[0].map((h, idx) => (h === null || h === undefined || h === "" ? `Column_${idx + 1}` : String(h)));
    const dataRows = matrix.slice(1);

    // Map rows to objects keyed by headers
    const mappedRows = dataRows.map((row) => {
      const obj = {};
      for (let i = 0; i < headerRow.length; i += 1) {
        obj[headerRow[i]] = row[i] ?? null;
      }
      return obj;
    });

    const sampleLimit = 500; // cap the stored sample to keep documents small
    const dataset = await Dataset.create({
      owner: req.userId,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      columns: headerRow,
      rowCount: mappedRows.length,
      dataSample: mappedRows.slice(0, sampleLimit),
    });

    await Activity.create({ user: req.userId, type: 'upload', action: `Uploaded ${dataset.originalName}`, details: `${dataset.rowCount} rows` });

    return res.status(201).json({
      id: dataset._id,
      originalName: dataset.originalName,
      columns: dataset.columns,
      rowCount: dataset.rowCount,
      createdAt: dataset.createdAt,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Failed to parse/upload file" });
  }
});

// GET /api/files/list - list current user's datasets
router.get("/list", protect, async (req, res) => {
  const datasets = await Dataset.find({ owner: req.userId })
    .sort({ createdAt: -1 })
    .select("originalName columns rowCount createdAt");
  res.json(datasets);
});

// GET /api/files/dataset/:id - get details + sample rows
router.get("/dataset/:id", protect, async (req, res) => {
  const dataset = await Dataset.findOne({ _id: req.params.id, owner: req.userId });
  if (!dataset) return res.status(404).json({ message: "Dataset not found" });
  res.json(dataset);
});

// DELETE /api/files/dataset/:id - delete a dataset owned by user
router.delete("/dataset/:id", protect, async (req, res) => {
  const dataset = await Dataset.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!dataset) return res.status(404).json({ message: "Dataset not found" });
  await Activity.create({ user: req.userId, type: 'user', action: `Deleted ${dataset.originalName}` });
  res.json({ message: 'deleted' });
});

// PUT /api/files/dataset/:id - update dataset (rename)
router.put("/dataset/:id", protect, async (req, res) => {
  try {
    const { originalName } = req.body;
    if (!originalName || originalName.trim() === '') {
      return res.status(400).json({ message: "Dataset name is required" });
    }

    const dataset = await Dataset.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { originalName: originalName.trim() },
      { new: true }
    );
    
    if (!dataset) return res.status(404).json({ message: "Dataset not found" });
    
    await Activity.create({ 
      user: req.userId, 
      type: 'user', 
      action: `Renamed dataset to ${dataset.originalName}` 
    });
    
    res.json({ message: 'updated', dataset });
  } catch (error) {
    console.error('Error updating dataset:', error);
    res.status(500).json({ message: "Failed to update dataset" });
  }
});

export default router;


