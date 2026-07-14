# Backend Development Guidelines

## Stack

```text
.NET 10
ASP.NET Core Web API
Entity Framework Core
SQL Server 2022
FluentValidation
AutoMapper
Swagger / OpenAPI
ILogger (nativo)
Docker
```

## Arquitetura

```text
Api → Application → Domain
Infrastructure → Application + Domain
```

- Controllers finos
- Regras de negócio em Services
- Acesso a dados via `IApplicationDbContext` (sem Repository Pattern)

## Convenções obrigatórias

- `CancellationToken` em Services e Controllers
- `AsNoTracking()` em consultas somente leitura
- Hard delete (sem soft delete)
- Delete de Vehicle/Customer com Opportunity → `409 Conflict`
- `PagedResponse<T>`: Items, Page, PageSize, TotalItems, TotalPages
- Enums tipados; nunca expor entidades
- Result Pattern: Success / ValidationError / NotFound / Conflict / Failure
- Logging com `ILogger` — sem Serilog
- Ordenação padrão das listagens: `LastModifiedAt` (`UpdatedAt ?? CreatedAt`) desc
- `Vehicle.Type` (`VehicleType`: SUV, Hatch, Sedan, Utilitario) obrigatório
- Listagem de clientes calcula Oportunidade Rápida (veículo Disponivel compatível com o interesse)

## HTTP

- GET/PUT → 200
- POST → 201
- DELETE → 204
- Validation → 400
- NotFound → 404
- Conflict → 409
- Unexpected → 500 (sem stack trace)

## Qualidade

Antes de finalizar: build, testes, migrations, Swagger, remover código morto.
