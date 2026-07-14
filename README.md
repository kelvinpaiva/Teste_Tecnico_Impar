# CarSales CRM — Teste Técnico Ímpar

CRM full stack para venda de carros.

## Características

- Clean Architecture
- SOLID
- DDD Lite
- Docker Compose
- SQL Server 2022
- Seed Automático
- Migrations Automáticas
- Swagger
- Health Checks
- Validação com FluentValidation
- React 19 + TypeScript Strict
- TanStack Query
- React Hook Form + Zod
- Material UI
- Testes Unitários
- Documentação orientada para IA

## Stack

| Camada | Tecnologia |
|---|---|
| API | .NET 10, ASP.NET Core, EF Core, FluentValidation, AutoMapper |
| Banco | SQL Server 2022 |
| Front | React 19, Vite, TypeScript, MUI, TanStack Query, RHF + Zod, Recharts |
| Ops | Docker Compose, nginx |

## Como executar

Pré-requisito: Docker Desktop com **no mínimo ~2 GB de RAM** disponíveis para o SQL Server.

```bash
docker compose up --build
```

Atalhos:

```bash
# Windows PowerShell
./start.ps1

# Linux/macOS
./start.sh

# Make
make up
```

## URLs

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API / Swagger | http://localhost:5000/swagger |
| Health Check | http://localhost:5000/health |

## Documentação

- [Manual de execução](docs/MANUAL.md)
- [Documentação semântica](docs/SEMANTIC.md)
- [QA](docs/QA.md)
- [Registro de testes com IA](docs/TEST_LOG.md)
- [Backend Guidelines](backend/BACKEND_GUIDELINES.md)
- [Frontend Guidelines](frontend/FRONTEND_GUIDELINES.md)
- [AGENTS.md](AGENTS.md)

## Módulos

- Dashboard com totais e gráficos
- Veículos (CRUD + filtros)
- Clientes (CRUD + filtros)
- Oportunidades (CRUD + filtros)

Na primeira inicialização o banco já nasce com dados pré-cadastrados (veículos, clientes e oportunidades).
