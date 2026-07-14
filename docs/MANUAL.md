# Manual de Execução

## Pré-requisitos

- Docker Desktop (ou Docker Engine + Compose plugin)
- Portas livres: `3000`, `5000`, `1433`
- **RAM mínima sugerida:** ~2 GB disponíveis para o container do SQL Server 2022

## Subir a aplicação

Na raiz do repositório:

```bash
docker compose up --build
```

Ou:

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

Na primeira execução o processo:

1. Sobe o SQL Server e aguarda healthcheck
2. Build da API (.NET 10 multi-stage)
3. Aplica migrations automaticamente
4. Executa seed idempotente (se o banco estiver vazio)
5. Sobe o frontend (nginx + proxy `/api`)

## Acessos

- Frontend: http://localhost:3000
- Swagger: http://localhost:5000/swagger
- Health: http://localhost:5000/health

## Variáveis de ambiente

Copie `.env.example` para `.env` se quiser customizar:

```env
MSSQL_SA_PASSWORD=Your_strong_Password123
```

A senha do SA deve atender a política de complexidade do SQL Server.

## Desenvolvimento local (opcional)

### Backend

1. Subir apenas o SQL Server via Docker
2. Ajustar `ConnectionStrings:DefaultConnection` em `backend/src/CarSalesCrm.Api/appsettings.json`
3. `dotnet run --project backend/src/CarSalesCrm.Api`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O Vite encaminha `/api` para `http://localhost:5000`.

## Troubleshooting

### Container `sqlserver` reinicia / OOM

- Aumente a memória do Docker Desktop (Settings → Resources)
- O compose define `mem_limit: 2g` e `MSSQL_MEMORY_LIMIT_MB=2048`

### API não sobe / falha de conexão

- Aguarde o healthcheck do SQL Server (pode levar ~40–90s na primeira vez)
- A API possui retry de conexão no startup

### Porta em uso

Altere o mapeamento em `docker-compose.yml`.

### Resetar dados

```bash
docker compose down -v
docker compose up --build
```

O volume do SQL Server será recriado e o seed rodará novamente.
