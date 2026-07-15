# Registro de Testes com IA

## Ferramenta

- Cursor (Composer / Agent)

## Abordagem

1. Definição de plano com guidelines frontend/backend orientados a IA
2. Geração estruturada por camadas: Domain → Application → Infrastructure → Api → Frontend → Docker → Docs
3. Validação contínua com `dotnet build`, `dotnet test` e `npm run build`

## Prompts / resultados (resumo)

| Etapa | Prompt / intenção | Resultado | Falhas | Correções |
|---|---|---|---|---|
| Planejamento | Montar CRM .NET 10 + React + SQL Server + Docker | Plano detalhado criado | Dúvidas de versão/.NET/DB | Ajustes: .NET 10, SQL Server, IApplicationDbContext, ILogger |
| Backend | Clean Architecture sem Repository | Solution, Services, Controllers | Solution .slnx no local errado | Reorganização em `backend/` |
| Testes | xUnit services/validators | 14 testes passando (delete 409 Vehicle/Customer, e-mail, sync Vendido) | — | — |
| Frontend scaffold | Vite React TS + MUI | App criada | Vite 8 incompatível com Node 20.17; MUI 9 API de Stack/TextField/icons | Downgrade Vite 5; props via `sx`/`slotProps`; ícones Outlined |
| Docker | Compose one-command | Dockerfile API/Front + SQL Server | Healthcheck SQL Server e memória | Retry na API + mem_limit 2g |
| Evolução UX/domínio | LastModifiedAt, Tipo veículo, sort 3 estados, Voltar, Oportunidade Rápida | Migration AddVehicleType + UI + matcher | Seed sem Utilitário Disponível | Ranger alterado para Disponivel; testes do matcher |

## Lições

- Guidelines semânticos reduzem inconsistência entre módulos gerados por IA
- Pin de versões (Vite/Node) evita falhas de build no ambiente do avaliador
- Regras de negócio documentadas (hard delete; Vehicle/Customer com Opportunity → 409 sem excluir; e-mail único; sync Opportunity→Vehicle ao vender) devem estar no SEMANTIC.md para a IA não “inventar” comportamentos

## Status

Implementação completa conforme plano. Validação final via `docker compose up --build`.
