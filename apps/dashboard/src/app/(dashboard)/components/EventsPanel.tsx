import { ActivityIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventItem } from "@/lib/types";

const formatTime = (iso: string) => new Date(iso).toLocaleString("pt-BR", { hour12: false });

const EVENT_TYPE_LABELS: Record<string, string> = {
  prompt: "Prompt",
  completion: "Conclusão",
  system: "Sistema",
};

const formatEventType = (type: string) => EVENT_TYPE_LABELS[type.toLowerCase()] ?? type.toUpperCase();

type EventsPanelProps = {
  events?: EventItem[];
  loading?: boolean;
};

export function EventsPanel({ events = [], loading }: EventsPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Eventos recentes</p>
          <CardTitle className="text-2xl text-slate-900">Fluxo em tempo real</CardTitle>
        </div>
        <ActivityIcon className="h-5 w-5 text-slate-400" />
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-400">Sincronizando com o Cursor...</p>
        ) : (
          events.map((event) => (
            <div key={event.eventId} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
                <span>{event.ide}</span>
                <span>{formatTime(event.timestamp)}</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900">{event.developerId}</p>
              <p className="text-sm text-slate-500">{formatEventType(event.eventType)} · {event.projectId}</p>
              <p className="mt-2 text-xs text-slate-500">
                {event.promptTokens} tokens de entrada · {event.completionTokens} tokens de saída
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
