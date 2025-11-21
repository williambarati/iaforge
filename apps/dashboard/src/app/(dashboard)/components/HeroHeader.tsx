const highlights = [
  { label: "Tokens monitorados", value: "12.3M", detail: "+6% vs semana passada" },
  { label: "Desenvolvedores", value: "48", detail: "8 squads conectados" },
  { label: "Alertas ativos", value: "7", detail: "Guardrails em ação" },
];

const forecastBars = [35, 58, 72, 48, 80, 60, 86];

export function HeroHeader() {
  return (
    <header className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="glass-panel p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Visão de uso</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl">
          Mantenha clareza executiva sobre cada token pago
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-500">
          Compare entrada versus conclusão de uso, destaque consumidores intensos e conte uma história
          consistente com um dashboard feito para quem decide.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
              <p className="text-sm text-slate-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-panel flex flex-col justify-between p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Previsão diária</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">+18%</p>
          <p className="text-sm text-slate-500">Uso projetado para as próximas 24 horas</p>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tokens consumidos</span>
            <span>Última sincronização há 2 min</span>
          </div>
          <div className="mt-3 flex h-32 items-end gap-2 rounded-2xl bg-slate-50 p-4">
            {forecastBars.map((height, index) => (
              <span
                key={`bar-${index}`}
                className="flex-1 rounded-full bg-gradient-to-t from-indigo-200 to-indigo-500"
                style={{ height: `${height}%` }}
                aria-hidden
              />
            ))}
          </div>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-slate-500">Assistente de previsão</p>
        </div>
      </div>
    </header>
  );
}
