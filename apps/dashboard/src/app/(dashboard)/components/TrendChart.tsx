"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyTrendPoint } from "@/lib/types";

const formatTokens = (value: number) =>
  Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);

type TrendChartProps = {
  points?: DailyTrendPoint[];
  loading?: boolean;
};

export function TrendChart({ points = [], loading }: TrendChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Volume diário</p>
          <CardTitle className="text-2xl text-slate-900">Tokens de entrada / saída</CardTitle>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-medium text-slate-500">
          Últimos 14 dias
        </span>
      </CardHeader>
      <CardContent className="h-72">
        {loading ? (
          <div className="flex h-full items-center justify-center text-slate-400">Carregando série temporal...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tokensIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tokensOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#cbd5f5" tickLine={false} axisLine={false} tickMargin={12} />
              <YAxis stroke="#cbd5f5" tickLine={false} axisLine={false} tickFormatter={formatTokens} width={80} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  return (
                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm shadow-soft">
                      <p className="text-slate-500">{payload[0].payload.date}</p>
                      {payload.map((item) => (
                        <p key={item.dataKey} className="text-slate-900">
                          {item.name}: {formatTokens(Number(item.value))} tokens
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="tokensOut"
                name="Saída de tokens"
                stroke="#7c3aed"
                fill="url(#tokensOut)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="tokensIn"
                name="Entrada de tokens"
                stroke="#10b981"
                fill="url(#tokensIn)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
