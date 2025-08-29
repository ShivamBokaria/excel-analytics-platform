import Summary from '../models/Summary.js';
import asyncHandler from 'express-async-handler';

// @desc    Generate AI summary using Gemini
// @route   POST /api/ai/generate-summary
// @access  Private
const generateSummary = asyncHandler(async (req, res) => {
  const { prompt, type } = req.body;
  const userId = req.userId;

  console.log('AI Summary request received:', { hasPrompt: !!prompt, type, userId });

  if (!prompt) {
    return res.status(400).json({ success: false, message: 'Prompt is required' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Gemini API key not configured on server' 
      });
    }

    console.log('Calling Gemini API...');

    // Gemini generateContent endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are a helpful data analyst assistant. Provide concise, insightful summaries of data and charts. Focus on key patterns, trends, and actionable insights.\n\nTask: ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    });

    console.log('Gemini response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return res.status(500).json({ 
        success: false, 
        message: `Gemini API error: ${response.status} - ${errorText}` 
      });
    }

    const geminiData = await response.json();
    let summary = '';
    try {
      const parts = geminiData.candidates?.[0]?.content?.parts || [];
      summary = parts.map(p => p.text).filter(Boolean).join('\n').trim();
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
    }

    if (!summary) {
      return res.status(500).json({ 
        success: false, 
        message: 'No summary generated from Gemini' 
      });
    }

    // Do NOT auto-save. Return the generated summary only.
    return res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error('AI Summary Generation Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    });
  }
});

// @desc    Get user's saved summaries
// @route   GET /api/ai/summaries
// @access  Private
const getSummaries = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const summaries = await Summary.find({ userId })
    .sort({ createdAt: -1 })
    .select('_id type summary createdAt dataSource');
  res.json(summaries);
});

// @desc    Delete a summary
// @route   DELETE /api/ai/summaries/:id
// @access  Private
const deleteSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const summary = await Summary.findById(id);
  if (!summary) {
    return res.status(404).json({ success: false, message: 'Summary not found' });
  }
  if (summary.userId.toString() !== userId) {
    return res.status(401).json({ success: false, message: 'Not authorized to delete this summary' });
  }

  await summary.deleteOne();
  res.json({ success: true, message: 'Summary deleted successfully' });
});

// @desc    Test Summary model
// @route   GET /api/ai/test
// @access  Private
const testSummary = asyncHandler(async (req, res) => {
  try {
    console.log('Testing Summary model...', req.userId);
    const testSummary = await Summary.create({
      userId: req.userId,
      type: 'dataset',
      summary: 'Test summary',
      prompt: 'Test prompt',
      dataSource: 'Test',
    });
    await Summary.findByIdAndDelete(testSummary._id);
    res.json({ success: true, message: 'Summary model is working', userId: req.userId });
  } catch (error) {
    console.error('Summary model test failed:', error);
    res.status(500).json({ success: false, message: `Summary model test failed: ${error.message}` });
  }
});

// @desc    Save an AI summary explicitly
// @route   POST /api/ai/summaries
// @access  Private
const saveSummary = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { type, summary, prompt, dataSource } = req.body || {};
  if (!type || !summary) {
    return res.status(400).json({ success: false, message: 'type and summary are required' });
  }
  try {
    const saved = await Summary.create({
      userId,
      type,
      summary,
      prompt: prompt || '',
      dataSource: dataSource || 'User generated',
    });
    return res.status(201).json({ success: true, id: saved._id });
  } catch (e) {
    console.error('Save summary error:', e);
    // surface mongoose validation errors if any
    if (e?.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: e.message });
    }
    return res.status(500).json({ success: false, message: e.message || 'Failed to save summary' });
  }
});

export {
  generateSummary,
  getSummaries,
  deleteSummary,
  testSummary,
  saveSummary,
};
