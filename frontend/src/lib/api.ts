import { Trend } from './mock-data';

const API_URL = '/api';

export async function getTrends(): Promise<Trend[]> {
  const res = await fetch(`${API_URL}/trends`);
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}

export async function getTrend(id: string): Promise<Trend> {
  const res = await fetch(`${API_URL}/trends/${id}`);
  if (!res.ok) throw new Error('Failed to fetch trend');
  return res.json();
}

export async function getBrief(id: string): Promise<Trend> {
  const res = await fetch(`${API_URL}/briefs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch brief');
  return res.json();
}

export async function generateBriefAPI(id: string): Promise<Trend> {
  const res = await fetch(`${API_URL}/trends/${id}/generate`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to generate brief');
  const data = await res.json();
  // We can fetch the updated brief or return data.brief, but let's just return the trend structure
  return getBrief(id);
}

export async function triggerIngestion(): Promise<any> {
  const res = await fetch(`${API_URL}/trends/ingest`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to ingest trends');
  return res.json();
}
