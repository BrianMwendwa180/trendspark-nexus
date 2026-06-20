import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trend from './models/Trend.js';

dotenv.config();

const mockTrends = [
  {
    id: "ai-replacing-junior-devs",
    trend_name: "AI is replacing junior developers",
    source: "Twitter",
    source_url: "https://twitter.com/search?q=junior+devs+ai",
    traffic_velocity: 290,
    urgency: "High",
    is_generated: true,
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: "A wave of layoff posts paired with Devin/Cursor demos has triggered fear-driven discourse around junior dev roles being automated.",
    what_is_happening: "Junior developers are expressing fear over AI tools like Devin and Cursor taking entry-level roles.",
    why_it_is_spreading: "High-engagement influencer threads are amplifying the narrative, causing panic among CS students.",
    estimated_lifespan: "2 weeks",
    generated_brief: {
      hook: "Everyone is asking if AI will replace developers. They're asking the wrong question.",
      angle: "Reframe the conversation: businesses that adopt AI-augmented developers ship 3x faster — early adopters win the next 18 months.",
      script: "Open on a recruiter ghosting a CS grad. Cut to a solo founder shipping a SaaS in a weekend with Cursor. The lesson: AI isn't replacing developers — it's replacing developers who don't use AI. Show three concrete workflows: spec -> scaffold -> ship. End with a CTA to download the playbook.",
      remix_template: "Green screen over a Cursor demo or a viral tweet about tech layoffs."
    }
  },
  {
    id: "micro-saas-side-hustles",
    trend_name: "Micro-SaaS as the new side hustle",
    source: "TikTok",
    source_url: "https://tiktok.com/tag/microsaas",
    traffic_velocity: 142,
    urgency: "Medium",
    is_generated: true,
    detectedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    description: "Indie hackers shipping $5k MRR niche tools are dominating build-in-public feeds, with weekend launches outperforming agency content.",
    what_is_happening: "Creators are sharing how they built small SaaS tools over the weekend and scaled them to $5k MRR quickly.",
    why_it_is_spreading: "Lower build costs (AI + Vercel) have collapsed the time-to-revenue for a single founder, making the dream attainable.",
    estimated_lifespan: "1 month",
    generated_brief: {
      hook: "I built a $4k/mo SaaS in 9 days. Here's the exact stack and the spreadsheet.",
      angle: "Show the new stack: idea on Monday, paying user on Friday. Document the math, not the motivation.",
      script: "Day-by-day build log. Show the Stripe dashboard, the landing page, the 3 channels that drove signups. End with the repeatable 9-day template.",
      remix_template: "Vlog-style quick cuts showing the laptop screen, coffee, and Stripe notifications."
    }
  },
  {
    id: "hustle-culture-backlash",
    trend_name: "Hustle culture backlash from Gen Z",
    source: "Instagram Reels",
    source_url: "https://instagram.com/explore/tags/softlife",
    traffic_velocity: 184,
    urgency: "High",
    is_generated: false,
    detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    description: "Gen Z creators are pushing back on 5am routines and grindset content with satirical 'soft life' POVs racking up millions of views.",
    what_is_happening: "There is a massive pushback against toxic productivity and the '5am club' mentality.",
    why_it_is_spreading: "Post-pandemic burnout is colliding with creator fatigue; satire converts faster than sincerity right now.",
    estimated_lifespan: "3 weeks"
  },
  {
    id: "kra-etims-panic",
    trend_name: "KRA introduces new e-TIMS requirements for small businesses",
    source: "Kenyan News",
    source_url: "https://nation.africa/kenya/business/kra-etims",
    traffic_velocity: 450,
    urgency: "High",
    is_generated: false,
    detectedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    description: "KRA mandates all businesses, including informal ones, to onboard e-TIMS.",
    what_is_happening: "The Kenya Revenue Authority has mandated e-TIMS for all businesses, causing panic among small online vendors and freelancers.",
    why_it_is_spreading: "Fear of Ksh 1 Million fines and confusion on how to register the e-TIMS lite version.",
    estimated_lifespan: "1 week"
  },
  {
    id: "ozempic-economy",
    trend_name: "The Ozempic economy reshaping CPG",
    source: "Reddit",
    source_url: "https://reddit.com/r/Entrepreneur",
    traffic_velocity: 121,
    urgency: "Low",
    is_generated: true,
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description: "Snack and beverage giants are reporting volume dips tied to GLP-1 adoption; analysts are calling it a once-in-a-decade reset.",
    what_is_happening: "Weight loss drugs like Ozempic are causing people to buy less junk food, impacting the FMCG sector globally and locally.",
    why_it_is_spreading: "Retailers and founders in the food space are trying to pivot to high-protein, low-sugar alternatives.",
    estimated_lifespan: "3 months",
    generated_brief: {
      hook: "Ozempic just rewrote the rules of the snack aisle. Here's who wins.",
      angle: "Help operators map their category to the GLP-1 thesis — protein up, sugar down, portion sizes down.",
      script: "Set the stakes with the volume drop chart. Break the market into winners (protein, hydration) and losers (large-format sweets). Give the 3-question framework operators should ask this quarter.",
      remix_template: "Stitch a video of someone talking about their diet changes, then switch to a whiteboard explaining the business impact."
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing
    await Trend.deleteMany({});
    console.log('Cleared existing trends');
    
    // Insert mock
    await Trend.insertMany(mockTrends);
    console.log(`Successfully seeded ${mockTrends.length} trends!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
}

seed();
