import express from 'express';
import Trend from '../models/Trend.js';

const router = express.Router();

// GET a specific brief (which is just a trend's detailed info)
router.get('/:id', async (req, res) => {
  try {
    const brief = await Trend.findOne({ id: req.params.id });
    if (!brief) {
      return res.status(404).json({ message: 'Brief not found' });
    }
    res.json(brief);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
