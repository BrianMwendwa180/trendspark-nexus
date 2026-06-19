import express from 'express';
import Trend from '../models/Trend.js';

const router = express.Router();

// GET all trends
router.get('/', async (req, res) => {
  try {
    const trends = await Trend.find();
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

export default router;
