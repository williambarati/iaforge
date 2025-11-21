import { AlertTriangleIcon, ShieldCheckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertItem } from "@/lib/types";

const severityConfig = {
  warning: {
    icon: AlertTriangleIcon,
    badge: "border-amber-200 bg-amber-50 text-amber-900",
    iconWrap: "bg-amber-100 text-amber-600",
  },
  info: {
    icon: ShieldCheckIcon,
    badge: "border-sky-200 bg-sky-50 text-sky-900",
    iconWrap: "bg-sky-100 text-sky-600",
  },
};

type AlertsPanelProps = {
  alerts?: AlertItem[];
  loading?: boolean;
};

export function AlertsPanel({ alerts = [], loading }: AlertsPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Alertas</p>
        <CardTitle className="text-2xl text-slate-900">Uso incomum</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-400">Monitorando atividade recente...</p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-emerald-600">Nenhum alerta ativo no momento.</p>
        ) : (
          alerts.map((alert) => {
            const config = severityConfig[alert.severity as keyof typeof severityConfig] ?? severityConfig.warning;
            const Icon = config.icon;
            return (
              <div
                key={`${alert.projectId}-${alert.developerId}-${alert.message}`}
                className={`rounded-2xl border ${config.badge} p-4`}
              >
                <div className="flex items-start gap-3">
                  <span className={`rounded-2xl p-2 ${config.iconWrap}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-base font-semibold">{alert.message}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      {alert.projectId} · {alert.developerId}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
