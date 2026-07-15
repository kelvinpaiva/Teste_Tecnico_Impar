# Front-end Guidelines

## Stack

```text
React 19
TypeScript (strict)
Vite
Material UI
React Router
Axios
React Hook Form
Zod
TanStack Query
Recharts
```

## Estrutura

```text
src/
  api/
  components/ (common, forms, layout, tables)
  hooks/
  layouts/
  pages/ (Dashboard, Vehicles, Customers, Opportunities)
  routes/
  services/
  types/
  utils/
  theme/
```

## Padrões

- Páginas só renderizam, chamam hooks e navegam
- Formulários: React Hook Form + Zod (sem useState por campo)
- HTTP apenas via instância Axios em `api/api.ts`
- Dados via TanStack Query
- Sem `any`
- Tabelas com paginação, busca, ordenação, loading, vazio e confirm delete
- Exclusão de Vehicle/Customer: se a API retornar 409 (oportunidade vinculada), exibir snackbar de erro e **não** remover da lista
- Ordenação por título da coluna: asc → desc → desabilitar (`cycleSortState` em `utils/sort.ts`)
- Ordenação padrão: `lastModifiedAt` desc
- Detalhes sempre com botão Voltar para a listagem
- Veículo: campo Tipo no formulário (SUV/Hatch/Sedan/Utilitario)
- Clientes: coluna Oportunidade Rápida (círculo branco/verde)
- Snackbar para sucesso/erro
- Cores apenas via tema MUI

## Módulos

Cada módulo: List / Form (create+edit) / Details

## Geração de código (IA)

- Reutilizar componentes existentes antes de criar novos
- Componentes < ~250 linhas
- Verificar TypeScript e build antes de finalizar
