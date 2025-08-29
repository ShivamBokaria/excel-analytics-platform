import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['dataset', 'chart', 'report', 'platform'],
  },
  summary: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: false,
    default: '',
  },
  dataSource: {
    type: String,
    default: 'User generated',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Index for faster queries
summarySchema.index({ userId: 1, createdAt: -1 });
summarySchema.index({ type: 1 });

export default mongoose.model('Summary', summarySchema);
