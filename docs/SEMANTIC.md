# Documentação Semântica — CarSales CRM

## Objetivo

Entregar um CRM de venda de carros com cadastro de veículos, clientes e oportunidades, consultas com filtros, dashboard e execução one-command via Docker Compose.

## Arquitetura

```text
Frontend (React 19)
  → nginx /api proxy
    → Api (Controllers)
      → Application (Services + Validators + DTOs)
        → IApplicationDbContext
          → Infrastructure (EF Core / SQL Server)
```

### Decisão de acesso a dados

Foi adotado `IApplicationDbContext` na Application, implementado por `ApplicationDbContext` na Infrastructure.

**Motivo:** o desafio é um CRUD com EF Core. Repository por entidade aumentaria boilerplate sem ganho proporcional. A abstração do DbContext preserva Clean Architecture e facilita testes com InMemory.

Não foram usados CQRS, MediatR ou Event Sourcing — deliberadamente, para manter simplicidade.

## Domínio (DDD Lite)

### Vehicle

- Brand, Model, Year, Price, Color, Mileage, **Type**, Status
- Type (`VehicleType`): SUV | Hatch | Sedan | Utilitario (mesmo domínio do Interesse Principal, **sem** CarroUsado/CarroZero)
- Status: Disponivel | Reservado | Vendido
- `CreatedAt` / `UpdatedAt` → exposto como **LastModifiedAt** (`UpdatedAt ?? CreatedAt`) — "Data de Criação/Atualização"

### Customer

- Name, Email, Phone, PrimaryInterest
- Interest: SUV | Hatch | Sedan | Utilitario | CarroUsado | CarroZero
- Email único
- LastModifiedAt (mesma regra)
- Na listagem: flags **HasQuickOpportunity** e **QuickOpportunityVehicleId**

### Opportunity

- CustomerId, VehicleId, Status, ProposedValue, Notes
- Status: NovoLead | EmNegociacao | PropostaEnviada | Vendido | Perdido
- LastModifiedAt (mesma regra)

## Regras de negócio mínimas

1. **E-mail único do cliente** — Create/Update retornam `409 Conflict` se duplicado.
2. **Integridade referencial** — Opportunity exige Customer e Vehicle existentes.
3. **Hard delete com proteção de dependência** — exclusões são físicas (sem soft delete). **Vehicle e Customer não podem ser excluídos** se existir Opportunity vinculada: a API retorna `409 Conflict` com mensagem clara e o registro permanece. Só é permitido hard delete de Vehicle/Customer **sem** oportunidades. Opportunity pode ser excluída normalmente (`204`). No EF/banco as FKs usam `Restrict`.
4. **Sincronização automática de status do veículo** — ao criar/atualizar Opportunity com status `Vendido`, o Vehicle associado passa automaticamente para `VehicleStatus.Vendido` (e `UpdatedAt` é atualizado) na mesma transação.
5. **Ordenação padrão das listagens** — por **LastModifiedAt** descendente (última criação/alteração).
6. **Oportunidade Rápida (cliente)** — botão na listagem:
   - Verde se existir veículo `Disponivel` compatível com o Interesse Principal
   - Branco caso contrário (clique → "Sem Oportunidade Rápida no momento")
   - Compatibilidade:
     - `CarroZero` → veículo Disponível com `Mileage == 0`
     - `CarroUsado` → veículo Disponível com `Mileage > 0`
     - `SUV` / `Hatch` / `Sedan` / `Utilitario` → veículo Disponível com `Type` igual ao interesse

## Endpoints

- `GET/POST /api/vehicles`, `GET/PUT/DELETE /api/vehicles/{id}` — filtros: `search`, `status`, `type`, `brand`, `year`, `page`, `pageSize`, `sortBy`, `sortDirection`
- `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/{id}` — listagem inclui Oportunidade Rápida; sort padrão `lastModifiedAt`
- `GET/POST /api/opportunities`, `GET/PUT/DELETE /api/opportunities/{id}`
- `GET /api/dashboard`
- `GET /health`

### UX de listagem / detalhes

- Clique nos títulos da grade: **asc → desc → desabilitar** (volta à ordenação padrão LastModifiedAt)
- Detalhes de Veículo, Cliente e Oportunidade possuem botão **Voltar** para a listagem
- Cadastro de oportunidades: combo de veículos **não lista Vendidos**; ao abrir pela Oportunidade Rápida, veículos compatíveis exibem círculo verde e há alerta explicativo na tela

Listagens retornam `PagedResponse<T>`:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 10,
  "totalItems": 52,
  "totalPages": 6
}
```

## Segurança mínima

- Validação FluentValidation
- Middleware global de exceções (sem stack trace no body)
- DTOs (entidades não são expostas)
- Connection string e senha SA via environment variables
- CORS configurado
- Hard delete com checagem de dependências (Vehicle/Customer com Opportunity → bloqueio `409`)

## Seed

Na inicialização: ~20 veículos, ~15 clientes, ~25 oportunidades. Idempotente.

## Roadmap (fora do escopo)

- Autenticação JWT
- Upload de imagens de veículos
- CI/CD
