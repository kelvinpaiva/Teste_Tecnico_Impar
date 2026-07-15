# CarSales CRM — Teste Técnico Ímpar

CRM full stack para venda de carros: cadastro de veículos, clientes e oportunidades, dashboard com gráficos e execução em um comando via Docker Compose.

## Stack

| Camada | Tecnologia |
|---|---|
| API | .NET 10, ASP.NET Core, EF Core, FluentValidation, AutoMapper, `ILogger` |
| Banco | SQL Server 2022 |
| Front | React 19, Vite, TypeScript strict, MUI, TanStack Query, React Hook Form + Zod, Recharts, Axios |
| Ops | Docker Compose, nginx (proxy `/api`), migrations e seed automáticos |

## Arquitetura

Clean Architecture + DDD Lite (sem CQRS, MediatR ou Repository Pattern):

```text
Frontend (React)
  → nginx /api
    → Api (Controllers)
      → Application (Services + Validators + DTOs)
        → IApplicationDbContext
          → Infrastructure (EF Core / SQL Server)
```

## Funcionalidades

- **Dashboard** — totais de veículos, clientes e oportunidades + gráficos por status
- **Veículos** — CRUD, filtros (texto, status, tipo, marca, ano), tipo (`SUV`, `Hatch`, `Sedan`, `Utilitario`), status (`Disponivel`, `Reservado`, `Vendido`)
- **Clientes** — CRUD, e-mail único, interesse principal, **Oportunidade Rápida** (match com veículo disponível)
- **Oportunidades** — CRUD com associação cliente + veículo; combo de veículos sem `Vendido`
- Listagens paginadas com ordenação padrão por **Data de Criação/Atualização** (`LastModifiedAt`)
- Ordenação nas colunas: asc → desc → desabilitar
- Swagger, health check e documentação orientada a IA (`AGENTS.md` + guidelines)

### Regras de negócio relevantes

- Hard delete (sem soft delete)
- **Vehicle / Customer com Opportunity vinculada não podem ser excluídos** → `409 Conflict`
- Opportunity marcada como `Vendido` → veículo associado passa automaticamente para `Vendido`
- E-mail de cliente único → `409` em duplicidade
- Seed idempotente na primeira subida (~20 veículos, ~15 clientes, ~25 oportunidades)

## Como executar

**Pré-requisitos:** Docker Desktop (ou Engine + Compose), portas `3000`, `5000` e `1433` livres, e ~**2 GB de RAM** disponíveis para o SQL Server.

Na raiz do repositório:

```bash
docker compose up --build
```

Alternativas:

```powershell
./start.ps1
```

```bash
chmod +x start.sh
./start.sh
```

```bash
make up
```

Na primeira execução: SQL Server sobe com healthcheck → API aplica migrations → seed (se banco vazio) → frontend via nginx.

### URLs

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API / Swagger | http://localhost:5000/swagger |
| Health | http://localhost:5000/health |

### Variáveis de ambiente

Copie `.env.example` para `.env` se quiser alterar a senha do SA:

```env
MSSQL_SA_PASSWORD=Your_strong_Password123
```

### Resetar dados

```bash
docker compose down -v
docker compose up --build
```

Detalhes de desenvolvimento local e troubleshooting: [docs/MANUAL.md](docs/MANUAL.md).

## Estrutura do repositório

```text
├── backend/          # Solution .NET (Api, Application, Domain, Infrastructure, UnitTests)
├── frontend/         # App React + Vite + MUI
├── docs/             # Plano, manual, semântica, QA e log de testes com IA
├── docker-compose.yml
├── AGENTS.md         # Contexto para agentes de IA
├── start.ps1 / start.sh
└── Makefile
```

## Documentação

| Documento | Conteúdo |
|---|---|
| [docs/PLAN.md](docs/PLAN.md) | Plano de implementação (decisões, escopo e evoluções) |
| [docs/MANUAL.md](docs/MANUAL.md) | Execução, env, desenvolvimento local, troubleshooting |
| [docs/SEMANTIC.md](docs/SEMANTIC.md) | Domínio, arquitetura e regras de negócio |
| [docs/QA.md](docs/QA.md) | Casos de teste / critérios de aceite |
| [docs/TEST_LOG.md](docs/TEST_LOG.md) | Registro do uso de IA nos testes |
| [backend/BACKEND_GUIDELINES.md](backend/BACKEND_GUIDELINES.md) | Convenções do backend |
| [frontend/FRONTEND_GUIDELINES.md](frontend/FRONTEND_GUIDELINES.md) | Convenções do frontend |
| [AGENTS.md](AGENTS.md) | Regras globais para geração de código |

## Testes

```bash
cd backend
dotnet test
```

Os testes unitários cobrem validators e regras dos services (incluindo bloqueio de delete com Opportunity e sync de status ao vender).
