# QA — Casos de Teste

## Critérios de aceite gerais

- `docker compose up --build` sobe frontend, API e SQL Server sem passos manuais
- Banco já possui seed na primeira abertura
- Interface responsiva (desktop/tablet/mobile)
- Feedback de loading, erro, sucesso e confirmação de exclusão

## Dashboard

| ID | Caso | Resultado esperado |
|---|---|---|
| D01 | Abrir Dashboard | Cards com totais de veículos, clientes e oportunidades |
| D02 | Visualizar gráficos | Veículos por status e Oportunidades por status |

## Veículos

| ID | Caso | Resultado esperado |
|---|---|---|
| V01 | Listar | Tabela paginada ordenada por Data de Criação/Atualização (desc) |
| V02 | Buscar | Filtro por texto reduz resultados |
| V03 | Filtrar status / tipo | Somente status/tipo selecionados |
| V04 | Criar com Tipo | 201 + item na listagem + snackbar de sucesso |
| V05 | Editar | Dados e Tipo atualizados; LastModifiedAt muda |
| V06 | Detalhes | Campos + Tipo + Data Criação/Atualização + botão Voltar |
| V07 | Excluir sem FK | 204 + removido da lista |
| V08 | Excluir com oportunidade | 409 + mensagem clara + snackbar de erro |
| V09 | Validação | Campos obrigatórios (incl. Tipo) bloqueiam submit |
| V10 | Ordenar grade | Clique no título: asc → desc → desabilitar |

## Clientes

| ID | Caso | Resultado esperado |
|---|---|---|
| C01 | Listar / buscar / filtrar interesse | Filtros funcionam; ordem padrão LastModifiedAt |
| C02 | Criar | Cadastro ok |
| C03 | Criar e-mail duplicado | 409 |
| C04 | Detalhes | Mostra oportunidades + botão Voltar |
| C05 | Excluir com oportunidade | 409 |
| C06 | Ordenar grade | Clique no título: asc → desc → desabilitar |
| C07 | Oportunidade Rápida branca | Clique → "Sem Oportunidade Rápida no momento" |
| C08 | Oportunidade Rápida verde | Interesse com veículo Disponível compatível; abre nova oportunidade pré-preenchida |
| C09 | Match CarroZero | Apenas veículos Disponíveis com KM = 0 |
| C10 | Match CarroUsado | Apenas veículos Disponíveis com KM > 0 |
| C11 | Match Sedan/SUV/Hatch/Utilitário | Tipo do veículo deve coincidir + Disponível |

## Oportunidades

| ID | Caso | Resultado esperado |
|---|---|---|
| O01 | Listar com filtros status/cliente/veículo | Filtros funcionam; ordem padrão LastModifiedAt |
| O02 | Criar com selects | Associação cliente+veículo persistida |
| O03 | Criar com IDs inválidos | 404 |
| O04 | Marcar como Vendido | Status da opportunity muda; veículo **não** muda automaticamente |
| O05 | Excluir | Hard delete com 204 |
| O06 | Ordenar grade | Clique no título: asc → desc → desabilitar |
| O07 | Detalhes Voltar | Botão retorna à listagem |
| O08 | Data Criação/Atualização | Visível na listagem e detalhes |
| O09 | Combo veículos | Não lista veículos Vendidos |
| O10 | Via Oportunidade Rápida | Alerta explicativo + círculo verde nos veículos compatíveis |

## Persistência / Docker

| ID | Caso | Resultado esperado |
|---|---|---|
| P01 | Restart containers | Dados permanecem (volume) |
| P02 | `docker compose down -v` + up | Seed reaplicado |
| P03 | Health endpoint | 200 quando API e banco ok |
