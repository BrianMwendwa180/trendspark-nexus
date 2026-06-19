import express from 'express';
import Trend from '../models/Trend.js';
import { ingestRedditKenya, ingestGoogleTrends } from '../services/ingestion.js';
import { generateBrief } from '../services/ai.js';

const router = express.Router();

// GET all trends (sorted by latest)
router.get('/', async (req, res) => {
  try {
    const trends = await Trend.find().sort({ detectedAt: -1 });
    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific trend
router.get('/:id', async (req, res) => {
  try {
    const trend = await Trend.findOne({ id: req.params.id });
    if (!trend) {
      return res.status(404).json({ message: 'Trend not found' });
    }
    res.json(trend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST trigger ingestion manually
router.post('/ingest', async (req, res) => {
  try {
    const [redditCount, googleCount] = await Promise.all([
      ingestRedditKenya(),
      ingestGoogleTrends()
    ]);
    res.json({ message: 'Ingestion complete', added: { reddit: redditCount, google: googleCount } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST generate script brief for a trend
router.post('/:id/generate', async (req, res) => {
  try {
    const trend = await Trend.findOne({ id: req.params.id });
    if (!trend) {
      return res.status(404).json({ message: 'Trend not found' });
    }

    if (trend.is_generated) {
      return res.json({ message: 'Brief already generated', brief: trend.generated_brief });
    }

    const brief = await generateBrief(trend);
    
    // Save to DB
    trend.generated_brief = brief;
    trend.is_generated = true;
    await trend.save();

    res.json({ message: 'Brief generated', brief: trend.generated_brief });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
