# Especificação das APIs

## Cursor Mock API (`cursor-mock-api`)
Base URL: `http://localhost:8080`

### `GET /health`
- **Descrição**: Verifica se a API está operacional e conectada ao MongoDB.
- **Resposta** `200`:
```json
{"status":"ok","mongo":"connected"}
```

### `GET /v1/projects/{projectId}/events`
- **Descrição**: Lista eventos brutos armazenados no Mongo.
- **Query params**:
  - `limit` (opcional, padrão 50, máx. 200)
  - `eventType` (opcional: `prompt`, `completion`, `system`)
- **Resposta** `200`:
```json
{
  "projectId": "alpha",
  "items": [
    {
      "eventId": "evt_001",
      "developerId": "dev_42",
      "ide": "VSCode",
      "tokensIn": 120,
      "tokensOut": 240,
      "timestamp": "2025-11-19T12:00:00Z"
    }
  ]
}
```

### `GET /v1/projects/{projectId}/usage/summary`
- **Descrição**: Retorna agregados por desenvolvedor e tipo de evento.
- **Query params**: `window` (`24h`, `7d`, `30d`) para aplicar filtros de data.
- **Resposta** `200`:
```json
{
  "projectId": "alpha",
  "window": "7d",
  "developers": [
    {
      "developerId": "dev_42",
      "events": 18,
      "tokensIn": 2800,
      "tokensOut": 6100
    }
  ]
}
```

## Insights API (`insights-api`)
Base URL: `http://localhost:8081`

### `GET /health`
- **Descrição**: Confirma conectividade com o Elasticsearch.

### `GET /insights/top-spenders`
- **Descrição**: Retorna os desenvolvedores que mais consumiram tokens.
- **Query params**: `size` (padrão 5).
- **Resposta** `200`:
```json
{
  "items": [
    {
      "developerId": "dev_42",
      "totalTokens": 8900,
      "projects": ["alpha", "beta"]
    }
  ]
}
```

### `GET /insights/daily-trend`
- **Descrição**: Série temporal dos tokens consumidos por dia.
- **Query params**: `days` (padrão 14).
- **Resposta** `200`:
```json
{
  "points": [
    {
      "date": "2025-11-10",
      "tokensIn": 1400,
      "tokensOut": 3600
    }
  ]
}
```

### `GET /insights/alerts`
- **Descrição**: Lista alertas simples baseados em limiares mockados (ex.: usuário excedeu 10k tokens/dia).
- **Resposta** `200`:
```json
{
  "alerts": [
    {
      "severity": "warning",
      "message": "dev_42 excedeu 10k tokens nas últimas 24h",
      "projectId": "alpha"
    }
  ]
}
```

> Observação: as rotas estão sujeitas a ajustes à medida que o MVP evoluir ou que os contratos oficiais do Cursor sejam detalhados.
