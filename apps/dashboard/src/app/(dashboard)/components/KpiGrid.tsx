import { BoltIcon, LineChartIcon, ShieldAlertIcon, UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatNumber = (value: number) =>
  Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export type KpiGridProps = {
  totalTokens: number;
  avgTokens: number;
  activeAlerts: number;
  trendDelta: number;
};

const KPI_ITEMS = [
  {
    key: "total",
    label: "Tokens (30 dias)",
    icon: LineChartIcon,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    format: formatNumber,
  },
  {
    key: "avg",
    label: "Média por dev",
    icon: UsersIcon,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    format: (value: number) => `${formatNumber(value)} tokens`,
  },
  {
    key: "alerts",
    label: "Alertas ativos",
    icon: ShieldAlertIcon,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    format: (value: number) => value.toString(),
  },
  {
    key: "trend",
    label: "Tendência semanal",
    icon: BoltIcon,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    format: (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`,
  },
];

export function KpiGrid({ totalTokens, avgTokens, activeAlerts, trendDelta }: KpiGridProps) {
  const values: Record<string, number> = {
    total: totalTokens,
    avg: avgTokens,
    alerts: activeAlerts,
    trend: trendDelta,
  };

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {KPI_ITEMS.map(({ key, label, icon: Icon, iconBg, iconColor, format }) => (
        <Card key={key} className="flex flex-col gap-3">
          <CardHeader className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {label}
              </CardTitle>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{format(values[key])}</p>
            </div>
            <span className={`rounded-2xl p-3 ${iconBg}`} aria-hidden>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">Atualizado há instantes</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
