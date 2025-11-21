# Arquitetura do MVP

## Visão geral
O MVP roda inteiramente em containers Docker para facilitar testes locais. Os componentes foram divididos em camadas complementares:

1. **Ingestão mockada** — `cursor-mock-api` expõe endpoints compatíveis com o Cursor e lê dados fictícios no MongoDB para simular eventos reais.
2. **Armazenamento operacional** — MongoDB guarda os eventos detalhados (prompt, resposta, tokens, usuário, IDE).
3. **Armazenamento analítico** — Elasticsearch mantém agregações e índices otimizados para consultas de insights.
4. **Insights** — `insights-api` consulta o Elasticsearch e devolve métricas prontas para o frontend (ranking de consumo, tendência diária, alertas simples).
5. **Seeders** — containers auxiliares carregam os dados base em Mongo e Elasticsearch durante o `docker compose up`.

## Topologia dos serviços
| Serviço | Porta | Responsabilidade |
| --- | --- | --- |
| `mongo` | 27017 | Banco operacional para eventos mockados |
| `mongo-seed` | n/a | Importa coleções JSON no Mongo uma única vez |
| `cursor-mock-api` | 8080 | API compatível com Cursor (FastAPI) |
| `elasticsearch` | 9200 | Nó único para consultas |
| `elastic-seeder` | n/a | Cria índice e envia documentos sintéticos |
| `insights-api` | 8081 | API de leitura do Elasticsearch |

Todos os containers compartilham a rede padrão do Compose. Volumes nomeados preservam os dados de Mongo e Elasticsearch entre reinicializações.

## Fluxo de dados
1. O seeder de Mongo importa eventos históricos (`data/mongo/seed/events.json`).
2. A API mockada expõe esses eventos e permite que ferramentas externas consultem consumo de tokens, simulando a API do Cursor.
3. Um dataset sintético resumido é carregado no Elasticsearch pelo `elastic-seeder`.
4. A API de insights executa consultas agregadas (ex.: top 5 usuários por tokens, consumo diário) e expõe endpoints REST prontos para o dashboard.

## Variáveis de ambiente principais
| Variável | Descrição |
| --- | --- |
| `MONGO_URI` | Connection string utilizada pela API mock |
| `ELASTICSEARCH_URL` | Endpoint HTTP do Elasticsearch |
| `ELASTICSEARCH_USER` / `ELASTICSEARCH_PASSWORD` | Reservado para futuras credenciais (não usado neste MVP) |

As variáveis ficam centralizadas em `.env` e são carregadas pelos serviços Python.

## Observabilidade e extensões
- Logs padrão dos containers + FastAPI (uvicorn) permanecem acessíveis via `docker compose logs`.
- Fácil substituição dos seeders por conectores reais (ex.: Logstash, Beats) quando houver dados produtivos.
- Possibilidade de adicionar Kibana para explorar dados sem ajustes no restante dos serviços.

## Evolução futura
1. Autenticação nas APIs usando API Keys ou OAuth.
2. Pipelines de ingestão reais capturando eventos diretamente dos IDEs.
3. Painéis em tempo real (websocket) e alertas baseados em limites configuráveis.
