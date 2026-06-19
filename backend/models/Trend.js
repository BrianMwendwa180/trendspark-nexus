import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  t: { type: String, required: true },
  v: { type: Number, required: true }
}, { _id: false });

const trendSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  emoji: { type: String },
  platforms: [{ type: String }],
  growth: { type: Number },
  virality: { type: Number },
  relevance: { type: Number },
  lifeDays: { type: Number },
  detectedAt: { type: String },
  engagement: { type: Number },
  category: { type: String },
  summary: { type: String },
  why: { type: String },
  angle: { type: String },
  hook: { type: String },
  script: { type: String },
  cta: { type: String },
  timeline: [timelineSchema]
}, { timestamps: true });

export default mongoose.model('Trend', trendSchema);
