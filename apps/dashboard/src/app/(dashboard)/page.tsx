import { HeroHeader } from "./components/HeroHeader";
import { KpiGrid } from "./components/KpiGrid";
import { TrendChart } from "./components/TrendChart";
import { TopSpendersCard } from "./components/TopSpendersCard";
import { AlertsPanel } from "./components/AlertsPanel";
import { EventsPanel } from "./components/EventsPanel";
import { cursorApi, insightsApi } from "@/lib/api";

const DEFAULT_PROJECT_ID = "alpha";

async function loadDashboardData(projectId: string) {
  const [topSpenders, dailyTrend, alerts, events] = await Promise.allSettled([
    insightsApi.getTopSpenders(),
    insightsApi.getDailyTrend(),
    insightsApi.getAlerts(),
    cursorApi.getEvents(projectId),
  ]);

  return {
    topSpenders: topSpenders.status === "fulfilled" ? topSpenders.value.items : [],
    dailyTrend: dailyTrend.status === "fulfilled" ? dailyTrend.value.points : [],
    alerts: alerts.status === "fulfilled" ? alerts.value.alerts : [],
    events: events.status === "fulfilled" ? events.value.items : [],
  };
}

function getKpiValues({
  topSpenders,
  dailyTrend,
  alerts,
}: Awaited<ReturnType<typeof loadDashboardData>>) {
  const totalTokens = topSpenders.reduce((sum, item) => sum + item.totalTokens, 0);
  const avgTokens = topSpenders.length > 0 ? totalTokens / topSpenders.length : 0;
  const activeAlerts = alerts.length;

  let trendDelta = 0;
  if (dailyTrend.length >= 2) {
    const first = dailyTrend[0].tokensOut;
    const last = dailyTrend[dailyTrend.length - 1].tokensOut;
    trendDelta = first === 0 ? 0 : ((last - first) / first) * 100;
  }

  return { totalTokens, avgTokens, activeAlerts, trendDelta };
}

export default async function DashboardPage() {
  const data = await loadDashboardData(DEFAULT_PROJECT_ID);
  const kpis = getKpiValues(data);

  return (
    <main className="space-y-8">
      <HeroHeader />
      <KpiGrid {...kpis} />
      <section className="grid gap-6 lg:grid-cols-3">
        <TrendChart points={data.dailyTrend} loading={data.dailyTrend.length === 0} />
        <TopSpendersCard items={data.topSpenders} loading={data.topSpenders.length === 0} />
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <AlertsPanel alerts={data.alerts} loading={data.alerts.length === 0} />
        <EventsPanel events={data.events} loading={data.events.length === 0} />
      </section>
    </main>
  );
}
