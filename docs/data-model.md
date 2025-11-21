# Modelos de dados

## MongoDB (`cursor-mock-api`)
Coleção: `events`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `_id` | ObjectId | Gerado automaticamente |
| `eventId` | string | Identificador externo (evt_001) |
| `projectId` | string | Projeto/time associado |
| `developerId` | string | Autor do evento |
| `ide` | string | IDE origem (VSCode, Cursor) |
| `eventType` | string | `prompt`, `completion`, `system` |
| `promptTokens` | int | Tokens enviados |
| `completionTokens` | int | Tokens recebidos |
| `timestamp` | datetime | ISO-8601 |
| `metadata` | objeto | Campos adicionais (branch, arquivo, linguagem) |

Exemplo (`data/mongo/seed/events.json`):
```json
{
  "eventId": "evt_001",
  "projectId": "alpha",
  "developerId": "dev_42",
  "ide": "Cursor",
  "eventType": "prompt",
  "promptTokens": 120,
  "completionTokens": 260,
  "timestamp": "2025-11-19T12:00:00Z",
  "metadata": {
    "file": "src/app.py",
    "language": "python"
  }
}
```

## Elasticsearch (`insights-api`)
Índice: `ia-usage`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `usageId` | keyword | ID único do documento |
| `projectId` | keyword | Projeto/time |
| `developerId` | keyword | Usuário |
| `date` | date | Dia consolidado |
| `tokensIn` | integer | Tokens enviados |
| `tokensOut` | integer | Tokens respondidos |
| `totalCostUsd` | float | Conversão mockada usando tarifa fictícia |

Exemplo (`data/elastic/seed/usage.json`):
```json
{
  "usageId": "u_2025-11-19_dev_42_alpha",
  "projectId": "alpha",
  "developerId": "dev_42",
  "date": "2025-11-19",
  "tokensIn": 1800,
  "tokensOut": 4200,
  "totalCostUsd": 0.78
}
```

## Regras de consistência
- Seeders garantem que as coleções/índices sejam recriados sempre que os volumes forem removidos.
- Os IDs seguem convenção `{prefix}_{data}_{dev}_{project}` para facilitar debug.
- Ampliação para mais coleções (ex.: `organizations`, `billing`) pode ser feita adicionando novos arquivos JSON e atualizando os seeders.
