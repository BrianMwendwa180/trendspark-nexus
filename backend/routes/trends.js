import express from 'express';
import Trend from '../models/Trend.js';
import { ingestRedditKenya, ingestGoogleTrends, ingestTikTok, ingestInstagramReels, ingestYouTubeShorts, ingestTwitterX, ingestKenyanNews } from '../services/ingestion.js';
import { filterTrend, generateBrief } from '../services/ai.js';
import { rewardTrendScout } from '../services/avalanche.js';

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
    const redditCount = await ingestRedditKenya();
    const googleCount = await ingestGoogleTrends();
    const tiktokCount = await ingestTikTok();
    const igCount = await ingestInstagramReels();
    const ytCount = await ingestYouTubeShorts();
    const xCount = await ingestTwitterX();
    const newsCount = await ingestKenyanNews();

    res.json({ 
      message: 'Ingestion complete', 
      added: { 
        reddit: redditCount, 
        google: googleCount,
        tiktok: tiktokCount,
        instagram: igCount,
        youtube: ytCount,
        twitter: xCount,
        news: newsCount
      } 
    });
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


// POST submit a crowd-sourced trend for AVAX bounty
router.post('/submit', async (req, res) => {
  try {
    const { trend_name, description, source_url, submitterAddress } = req.body;

    if (!trend_name || !submitterAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const id = `scout-${Date.now()}`;
    const trend = new Trend({
      id,
      trend_name,
      description,
      source_url,
      source: 'Crowdsourced (Web3)',
      traffic_velocity: 0,
      urgency: 'Medium',
      submitterAddress,
      rewardStatus: 'PENDING'
    });

    // 1. AI Filtration
    const aiResult = await filterTrend(trend);
    if (!aiResult || !aiResult.is_relevant) {
      trend.rewardStatus = 'FAILED';
      await trend.save();
      return res.status(400).json({ message: 'Trend rejected by AI filter. No reward sent.', trend });
    }

    trend.what_is_happening = aiResult.what_is_happening;
    trend.why_it_is_spreading = aiResult.why_it_is_spreading;
    trend.estimated_lifespan = aiResult.estimated_lifespan;

    // 2. Trend is valid! Trigger AVAX micro-reward
    const rewardAmount = '0.01'; // AVAX
    const txHash = await rewardTrendScout(submitterAddress, rewardAmount);

    trend.rewardStatus = 'PAID';
    trend.transactionHash = txHash;
    trend.rewardAmount = rewardAmount;

    // 3. Generate Brief instantly for the dashboard
    const brief = await generateBrief(trend);
    trend.generated_brief = brief;
    trend.is_generated = true;

    await trend.save();

    res.json({ message: 'Trend approved! Reward sent.', trend });
  } catch (error) {
    console.error('Submit Error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
