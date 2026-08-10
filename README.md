# Logbook

Projeto full stack para organizar treinos por divisao, cadastrar exercicios e acompanhar a progressao no logbook.

## O que ele faz

- cria divisoes de treino por dia
- cadastra exercicios ligados a cada divisao
- registra cargas e repeticoes no logbook
- sincroniza o logbook para atualizar os dados do exercicio
- guarda historico das evolucoes
- usa autenticacao com access token e refresh token em cookie

## Stack

- Node.js com ES Modules
- Express 5
- Prisma + PostgreSQL
- React 19 + Vite
- Tailwind CSS
- Swagger/OpenAPI
- Vitest + Supertest
- Docker

## Visao geral

O projeto segue uma estrutura em camadas, tanto na API quanto no frontend:

- `routes`: entrada HTTP
- `middleware`: auth e tratamento de erros
- `schemas`: validacao de dados
- `services`: regras de negocio
- `repositories`: acesso ao banco
- `components`: telas e componentes React
- `utils`: funcoes auxiliares

## Como o fluxo funciona

1. O usuario cria uma divisao de treino por dia.
2. Depois cadastra os exercicios dessa divisao.
3. Durante o treino, registra a performance no logbook.
4. O logbook pode ser sincronizado para atualizar o exercicio.
5. O historico guarda o antes e depois dessas mudancas.

## Como rodar com Docker

1. Crie o arquivo `.env` na raiz:

```env
DATABASE_URL='postgresql://user:password@database:5432/logbook'
POSTGRES_USER="user"
POSTGRES_PASS="password"
POSTGRES_DB="logbook"
JWT_SECRET="sua_chave_jwt"
```

2. Suba tudo com:

```bash
docker compose up --build
```

3. Acesse:

- API: `http://localhost:8000/api`
- Docs: `http://localhost:8000/docs`
- Frontend: `http://localhost:5173`

## Autenticacao

- O login retorna um access token valido por 12h.
- O refresh token fica em cookie HTTP-only.
- Para rotas protegidas, envie:

```http
Authorization: Bearer <seu_token>
```

## Padrao de resposta

A API segue este formato:

```json
{
  "success": true,
  "data": {}
}
```

Em erros de validacao, `data` traz as mensagens do Zod.

## Testes e qualidade

- A suite usa Vitest + Supertest.
- O CI roda em GitHub Actions com PostgreSQL.
- A documentacao da API fica em `/docs`.

## Estrutura resumida

```text
src/
  config/
  middleware/
  repositories/
  routes/
  schemas/
  services/
  utils/
frontend/
  src/
    components/
    services/
    utils/
prisma/
.github/workflows/
docker-compose.yml
```
