# Logbook

Projeto full stack para gerenciamento de treinos por divisão, exercícios e logbooks de progressão.

## Visão geral

Tanto a API quanto o Frontend seguem a regra de arquitetura em camadas:

- `routes`: Entrada HTTP.
- `middleware/schemas`: Validação com Zod + Autenticação JWT.
- `services`: Regras de negócio.
- `repositories`: Acesso ao SQL.
- `components`: Componentes React.
- `utils`: Funções utilitárias.

Fluxo principal:

1. Cadastro de divisão de treino por dia.
2. Cadastro de exercícios vinculados a uma divisão.
3. Registro de performance no logbook.
4. Sincronização do logbook para atualizar os dados do exercício.
5. Histórico dos exercícios que foram sincronizados.

## Stack técnica

- Node.js (ES Modules)
- Vite + React.js
- Express 5
- Prisma

## Requisitos

- Node.js 22+ (recomendado)
- NPM 10+
- Docker

## Instalação (Docker)

1. Crie o arquivo `.env` na raiz:

```env
DATABASE_URL='postgresql://user:password@database:5432/logbook'
POSTGRES_USER="user"
POSTGRES_PASS="password"
POSTGRES_DB="logbook"
JWT_SECRET="sua_chave_jwt"
```

2. Suba os containers:

```bash
docker-compose up database --build
docker-compose up app --build
docker-compose up frontend --build
```

4. Acesse:

- API base: `http://localhost:8000/api/`
- Frontend: `http://localhost:5173`

## Estrutura do projeto

```text
logbook/
|- .github/workflows
|  |- ci.yml
|- src/
|  |- config/
|  |  |- database.js
|  |- middleware/
|  |  |- auth.js
|  |  |- error.js
|  |- repositories/
|  |  |- divisionRepo.js
|  |  |- exercisesRepo.js
|  |  |- historicalRepo.js
|  |  |- logbookRepo.js
|  |  |- userRepo.js
|  |- routes/
|  |  |- divisionRoute.js
|  |  |- exercisesRoute.js
|  |  |- historicalRoute.js
|  |  |- logbookRoute.js
|  |  |- userRoute.js
|  |- schemas/
|  |  |- fiels.js
|  |  |- ids.js
|  |- services/
|  |  |- divisionService.js
|  |  |- exercisesService.js
|  |  |- historicalService.js
|  |  |- refreshTokenService.js
|  |  |- userService.js
|  |- utils/
|  |  |- sinclogbooks.js
|  |  |- token.js
|  |  |- zoderror.js
|  |- server.js
|- docker-compose.yml
|- Dockerfile
|- prisma.config.ts
|- frontend/
|  |- src/
|  |  |- components.js
|  |  |  |- activeworkout.jsx
|  |  |  |- dashboard.jsx
|  |  |  |- division.jsx
|  |  |  |- history.jsx
|  |  |  |- landingPage.jsx
|  |  |  |- layout.jsx
|  |  |  |- login.jsx
|  |  |  |- register.jsx
|  |  |  |- sync.jsx
|  |  |- services/
|  |  |  |- auth.js
|  |  |  |- divisionService.js
|  |  |  |- exercisesService.js
|  |  |  |- historicalService.js
|  |  |  |- logbookService.js
|  |  |  |- loginService.js
|  |  |  |- refreshTokenService.js
|  |  |  |- registerService.js
|  |  |  |- syncLogbookService.js
|  |  |- utils/
|  |  |  |- capitalize.js
|  |  |  |- day.js
|  |  |- App.jsx
|  |- Dockerfile
```

## Padrão de resposta

A API segue o formato:

```json
{
  "success": true,
  "data": {}
}
```

Em erro de validação `data` retorna mensagens do Zod.

## Autenticação (JWT)

- Registre um usuário e faça login para obter o token.
- O token expira em **12h**.
- Para rotas protegidas, envie o header:

```http
Authorization: Bearer <seu_token>
```