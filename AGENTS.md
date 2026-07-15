# AGENTS.md

Contexto para agentes de IA (Cursor, Claude Code, etc.).

Antes de gerar código, leia:

1. [docs/SEMANTIC.md](docs/SEMANTIC.md) — domínio, arquitetura e regras
2. [backend/BACKEND_GUIDELINES.md](backend/BACKEND_GUIDELINES.md)
3. [frontend/FRONTEND_GUIDELINES.md](frontend/FRONTEND_GUIDELINES.md)
4. [docs/QA.md](docs/QA.md) — critérios de aceite

## Regras globais

- Não inventar CQRS/MediatR/Event Sourcing
- Usar `IApplicationDbContext` (sem Repository Pattern)
- Hard delete (sem soft delete). **Não permitir** Delete de Vehicle/Customer se houver Opportunity → `409 Conflict`
- `CancellationToken` e `AsNoTracking()` nas leituras
- Ao marcar oportunidade como `Vendido`, sincronizar automaticamente o status do veículo para `Vendido`
- Preferir reutilizar componentes/serviços existentes
