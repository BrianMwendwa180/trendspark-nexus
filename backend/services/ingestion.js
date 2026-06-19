import Parser from 'rss-parser';
import Trend from '../models/Trend.js';
import { filterTrend } from './ai.js';

const parser = new Parser();

export async function ingestRedditKenya() {
  try {
    // Note: Reddit JSON API might require User-Agent
    const response = await fetch('https://www.reddit.com/r/Kenya/hot.json?limit=25', {
      headers: { 'User-Agent': 'Kuzana-Trendjack/1.0' }
    });
    const data = await response.json();
    
    const posts = data.data.children;
    let addedCount = 0;

    for (const post of posts) {
      const p = post.data;
      if (p.stickied) continue; // Skip pinned posts

      const trendData = {
        id: `reddit-${p.id}`,
        trend_name: p.title,
        description: p.selftext || '',
        source_url: `https://reddit.com${p.permalink}`,
        source: 'Reddit (r/Kenya)',
        traffic_velocity: p.score,
        urgency: p.score > 500 ? 'High' : p.score > 100 ? 'Medium' : 'Low'
      };

      // Check if it already exists
      const exists = await Trend.findOne({ id: trendData.id });
      if (exists) {
        // Update velocity
        await Trend.updateOne({ id: trendData.id }, { traffic_velocity: trendData.traffic_velocity, urgency: trendData.urgency });
        continue;
      }

      // Filter via AI
      const isRelevant = await filterTrend(trendData);
      if (isRelevant) {
        await Trend.create(trendData);
        addedCount++;
      }
    }

    return addedCount;
  } catch (error) {
    console.error('Reddit Ingestion Error:', error);
    return 0;
  }
}

export async function ingestGoogleTrends() {
  try {
    // Google Trends RSS for Kenya (geo=KE)
    const feed = await parser.parseURL('https://trends.google.com/trends/trendingsearches/daily/rss?geo=KE');
    let addedCount = 0;

    for (const item of feed.items) {
      // Traffic is usually stored in ht:approx_traffic
      const trafficStr = item['ht:approx_traffic'] || '0';
      const traffic = parseInt(trafficStr.replace(/[^0-9]/g, ''), 10) || 0;

      const trendData = {
        id: `gtrends-${item.title.replace(/\s+/g, '-').toLowerCase()}`,
        trend_name: item.title,
        description: item.contentSnippet || item.content || '',
        source_url: item.link,
        source: 'Google Trends (Kenya)',
        traffic_velocity: traffic,
        urgency: traffic > 10000 ? 'High' : traffic > 2000 ? 'Medium' : 'Low'
      };

      const exists = await Trend.findOne({ id: trendData.id });
      if (exists) {
        await Trend.updateOne({ id: trendData.id }, { traffic_velocity: trendData.traffic_velocity, urgency: trendData.urgency });
        continue;
      }

      // Filter via AI
      const isRelevant = await filterTrend(trendData);
      if (isRelevant) {
        await Trend.create(trendData);
        addedCount++;
      }
    }

    return addedCount;
  } catch (error) {
    console.error('Google Trends Ingestion Error:', error);
    return 0;
  }
}
