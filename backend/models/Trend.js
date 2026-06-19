import mongoose from 'mongoose';

const trendSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  trend_name: { type: String, required: true },
  description: { type: String },
  source_url: { type: String },
  source: { type: String, required: true }, // 'Reddit' or 'Google Trends'
  traffic_velocity: { type: Number, default: 0 },
  urgency: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
  generated_brief: {
    hook: { type: String },
    angle: { type: String },
    script: { type: String },
    remix_template: { type: String }
  },
  is_generated: { type: Boolean, default: false },
  detectedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Trend', trendSchema);
