# Plano do Frontend MVP

## Objetivo
Disponibilizar rapidamente um dashboard que demonstre valor utilizando os endpoints da `insights-api`. O foco é validar hipóteses, não entregar um produto final.

## Requisitos
- Visualizar ranking de consumo por desenvolvedor.
- Mostrar tendência diária de tokens (gráfico de linhas simples).
- Exibir alertas em formato de cards (warning/info).
- Permitir filtro por projeto (mockado a partir dos dados disponíveis).

## Stack sugerida
1. **Next.js + TypeScript**: entrega rápida, rotas estáticas, integração fácil com APIs REST.
2. **UI Library**: Chakra UI ou Tailwind para aceleração.
3. **Deploy**: opcional via Vercel ou container adicional no mesmo Compose quando o MVP precisar ser compartilhado.

## Integração com a API
- Consumir `GET /insights/top-spenders` para montar cards e tabelas.
- Consumir `GET /insights/daily-trend` para renderizar o gráfico (ex.: `recharts` ou `nivo`).
- Consumir `GET /insights/alerts` para seção de alertas.

## Roadmap
1. Criar app Next com rota única `/dashboard` e componentes mockados (placeholders com dados do `insights-api`).
2. Adicionar chamadas client-side usando `fetch` com SWR para cache.
3. Evoluir para chamadas server-side/edge quando autenticação e multi-tenant forem necessários.
4. Integrar autenticação leve (API key) antes de expor o ambiente.

Este plano pode ser ajustado caso o time prefira alternativas como Streamlit ou dashboards low-code, mantendo o backend inalterado.
