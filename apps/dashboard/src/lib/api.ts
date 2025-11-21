import {
  AlertsResponse,
  DailyTrendResponse,
  EventsResponse,
  TopSpendersResponse,
} from "./types";

const INSIGHTS_API = process.env.NEXT_PUBLIC_INSIGHTS_API ?? "http://localhost:8081";
const CURSOR_API = process.env.NEXT_PUBLIC_CURSOR_API ?? "http://localhost:8080";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Failed request: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const insightsApi = {
  getTopSpenders: () => fetchJson<TopSpendersResponse>(`${INSIGHTS_API}/insights/top-spenders`),
  getDailyTrend: (days = 14) =>
    fetchJson<DailyTrendResponse>(`${INSIGHTS_API}/insights/daily-trend?days=${days}`),
  getAlerts: () => fetchJson<AlertsResponse>(`${INSIGHTS_API}/insights/alerts`),
};

export const cursorApi = {
  getEvents: (projectId: string, limit = 8) =>
    fetchJson<EventsResponse>(`${CURSOR_API}/v1/projects/${projectId}/events?limit=${limit}`),
};
