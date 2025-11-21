import { TrophyIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopSpender } from "@/lib/types";

const formatTokens = (value: number) =>
  Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);

type TopSpendersCardProps = {
  items?: TopSpender[];
  loading?: boolean;
};

export function TopSpendersCard({ items = [], loading }: TopSpendersCardProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Maiores consumidores</p>
          <CardTitle className="text-2xl text-slate-900">Ranking de tokens</CardTitle>
        </div>
        <TrophyIcon className="h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-slate-400">Calculando ranking...</p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.developerId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-slate-900">{item.developerId}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.projects.join(" · ")}</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-slate-900">{formatTokens(item.totalTokens)} tokens</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
