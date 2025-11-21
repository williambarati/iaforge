# iaforge

MVP de observabilidade para uso de LLMs por times de desenvolvimento. A proposta é simular as APIs do Cursor, coletar métricas de tokens por evento e expor insights básicos para um dashboard validando a ideia sem depender das credenciais oficiais.

## Objetivos
- Disponibilizar uma API mockada compatível com o Cursor, alimentada por dados fictícios no MongoDB.
- Persistir eventos consolidados em um cluster single-node do Elasticsearch para análises rápidas.
- Expor uma API de insights em Python que lê o Elasticsearch e prepara indicadores para um futuro frontend.
- Garantir execução local via `docker compose` sem pré-requisitos além de Docker e 8GB de RAM livres.

## Stack
- **Python + FastAPI** para `cursor-mock-api` e `insights-api`.
- **MongoDB** para armazenar os eventos brutos mockados.
- **Elasticsearch** para consultas analíticas; inclui um seeder que cria índice/mapeamento e envia dados sintéticos.
- **Next.js + Tailwind** para o dashboard comercial dentro de `apps/dashboard`.
- **Docker Compose** para orquestrar serviços, redes e volumes.

## Como executar
1. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis se necessário.
2. Execute `docker compose up --build` na raiz do repositório.
3. Aguarde os seeders finalizarem; os containers das APIs permanecerão ativos.
4. Acesse:
	- `http://localhost:3000` para o dashboard IAForge Insights.
	- `http://localhost:8080/docs` para a API que emula o Cursor.
	- `http://localhost:8081/docs` para a API de insights.

## Reexecutar os seeders
Sempre que os arquivos em `data/mongo/seed` ou `data/elastic/seed` forem atualizados, rode novamente os seeders para popular os bancos já existentes:

```powershell
docker compose up -d mongo elasticsearch
docker compose run --rm mongo-seed
docker compose run --rm elastic-seeder
```

Os containers terminam após importar os dados; não é necessário derrubar o restante da stack.

## Documentação complementar
- `docs/architecture.md` — visão de arquitetura e componentes.
- `docs/api-spec.md` — contratos das APIs mock e de insights.
- `docs/data-model.md` — coleções/tabelas e exemplos de payload.
- `docs/frontend-plan.md` — direção proposta para o dashboard MVP.

## Próximos passos sugeridos
- Adicionar autenticação e rastreamento de times/organizações.
- Conectar IDEs reais quando credenciais do Cursor estiverem disponíveis.
- Explorar integrações com provedores de billing para cruzar custo real com uso projetado.
