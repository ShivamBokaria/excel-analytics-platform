import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { generateSummary, getSummaries, deleteSummary, testSummary, saveSummary } from '../controllers/aiController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Test Summary model
router.get('/test', testSummary);

// Generate AI summary (no auto-save)
router.post('/generate-summary', generateSummary);

// Explicit save
router.post('/summaries', saveSummary);

// Get user's saved summaries
router.get('/summaries', getSummaries);

// Delete a summary
router.delete('/summaries/:id', deleteSummary);

export default router;
