import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { submitTrend } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

export const Route = createFileRoute('/submit')({
  component: SubmitTrendPage,
});

function SubmitTrendPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    trend_name: '',
    description: '',
    source_url: '',
    submitterAddress: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.submitterAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return toast.error("Invalid Avalanche C-Chain address. Must start with 0x and be 42 characters.");
    }
    
    setLoading(true);
    toast.loading('Evaluating trend via AI...', { id: 'submit-toast' });
    
    try {
      const trend = await submitTrend(formData);
      if (trend.rewardStatus === 'PAID') {
        toast.success(`Trend approved! 0.01 AVAX rewarded.`, { id: 'submit-toast', duration: 5000 });
      } else {
        toast.success(`Trend submitted! Status: ${trend.rewardStatus}`, { id: 'submit-toast' });
      }
      setTimeout(() => navigate({ to: '/' }), 2000);
    } catch (err: any) {
      toast.error(err.message, { id: 'submit-toast', duration: 4000 });
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Toaster />
      <div className="max-w-2xl mx-auto py-12">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">Submit a Web3 Bounty Trend</h1>
          <p className="mt-2 text-muted-foreground">Scout viral trends in Kenya and earn AVAX micro-rewards if they pass the Kuzana AI filter.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-2">Trend Title</label>
            <input 
              required 
              type="text" 
              className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="e.g. Generation Z pushing back on hustle culture"
              value={formData.trend_name}
              onChange={e => setFormData({ ...formData, trend_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Why is it trending? (Description)</label>
            <textarea 
              required 
              rows={4}
              className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Describe the trend context and business implications..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Source URL</label>
            <input 
              required 
              type="url" 
              className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="https://tiktok.com/..."
              value={formData.source_url}
              onChange={e => setFormData({ ...formData, source_url: e.target.value })}
            />
          </div>

          <div className="border-t border-border pt-6">
            <label className="block text-sm font-medium mb-2">Avalanche Wallet Address (C-Chain)</label>
            <input 
              required 
              type="text" 
              className="w-full rounded-md border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="0x..."
              value={formData.submitterAddress}
              onChange={e => setFormData({ ...formData, submitterAddress: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-2">Bounty payouts will be processed natively on Fuji Testnet.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "Processing..." : "Submit Trend for Review"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
