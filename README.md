# Logbook API

API REST para gerenciamento de treinos por divisao, exercicios e logbooks de progresso.

## Visao geral

Esta API segue arquitetura em camadas:

- `routes`: entrada HTTP
- `middleware`: validacao com Joi
- `services`: regras de negocio
- `repositories`: acesso ao MongoDB
- `models`: schemas Mongoose

Fluxo principal:

1. Cadastro de divisao de treino por dia.
2. Cadastro de exercicios vinculados a uma divisao.
3. Registro de performance no logbook.
4. Sincronizacao do logbook para atualizar os dados do exercicio.
5. Registro de falhas inesperadas de sincronizacao em `LogErros`.

## Stack tecnica

- Node.js (ES Modules)
- Express 5
- MongoDB + Mongoose
- Docker
- Joi
- Swagger (`swagger-jsdoc` + `swagger-ui-express`)
- Jest + Supertest

## Requisitos

- Node.js 20+ (recomendado)
- NPM 10+
- Instancia MongoDB disponivel (Nuvem ou Docker)

## Instalacao (local)

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz:

```env
PORT=8000
MONGO_URI=mongodb+srv://user:password@cluster0.ynyrkdn.mongodb.net/logbook (conexão atlas nuvem)
```

3. Inicie a API:

```bash
npm run dev
```

4. Acesse:

- API base: `http://localhost:8000/api`
- Swagger: `http://localhost:8000/docs`

## Docker (opcional)

O `docker-compose.yml` sobe MongoDB e API.

1. Ajuste o `.env` para o container do MongoDB:

```env
PORT=8000
MONGO_URI=mongodb://user:password@mongodb:27017/logbook?authSource=admin (conexão local)
MONGO_USERNAME=user
MONGO_PASSWORD=password
```

2. Suba os servicos:

```bash
docker compose up --build
```

## Scripts

```bash
npm run dev
npm test
```

## Estrutura do projeto

```text
logbook/
|- src/
|  |- config/
|  |  |- mongodb.js
|  |- middleware/
|  |  |- divisaoMiddleware.js
|  |  |- exercicioMiddleware.js
|  |  |- idMongoMiddleware.js
|  |  |- logbookMiddleware.js
|  |  |- sinclogbookMiddleware.js
|  |  |- validate.js
|  |- models/
|  |  |- dSchema.js
|  |  |- eSchema.js
|  |  |- lSchema.js
|  |  |- logErrosSchema.js
|  |- repositories/
|  |  |- divisaoRepository.js
|  |  |- exercicioRepository.js
|  |  |- logbookRepository.js
|  |- routes/
|  |  |- divisao.js
|  |  |- exercicio.js
|  |  |- logbook.js
|  |- services/
|  |  |- divisaoService.js
|  |  |- exercicioService.js
|  |  |- logbookService.js
|  |- utils/
|  |  |- Capitalizar.js
|  |  |- sincronizarExercicioComLogBook.js
|  |- server.js
|- __tests__/
|  |- routes/
|  |  |- divisao.test.js
|  |  |- exercicio.test.js
|  |  |- logbook.test.js
|- package.json
|- jest.config.js
|- babel.config.js
|- docker-compose.yml
|- Dockerfile
```

## Padrao de resposta

A API segue o formato:

```json
{
  "success": true,
  "data": {}
}
```

Em erro de validacao (`422`), `data` retorna mensagens do Joi.

## Endpoints

Base path: `/api` (use o prefixo antes das rotas, e.g /api/divisoes)

### Divisao

- `GET /divisoes` - lista todas as divisoes
- `GET /divisao/:id` - busca uma divisao por ID
- `POST /divisao` - cria uma divisao
- `DELETE /deletar_divisao/:id` - exclui uma divisao

Exemplo `POST /divisao`:

```json
{
  "nome": "Push 1",
  "dia": "Segunda"
}
```

Regras:

- `dia` deve ser um de: `Segunda`, `Terça`, `Quarta`, `Quinta`, `Sexta`, `Sábado`, `Domingo`
- nao pode existir mais de uma divisao para o mesmo dia

### Exercicio

- `GET /exercicios` - lista exercicios
- `GET /exercicio/:id` - busca exercicio por ID
- `POST /exercicio` - cria exercicio e vincula a uma divisao
- `DELETE /deletar_exercicio/:id` - exclui exercicio

Exemplo `POST /exercicio`:

```json
{
  "nome": "Supino Reto",
  "series": 3,
  "carga_atual": 40,
  "repeticoes_alvo": 10,
  "repeticoes_atuais": 8,
  "divisao": "65f000000000000000000000"
}
```

### Logbook

- `GET /logbooks` - lista logbooks
- `GET /logerros` - lista erros de sincronizacao nao resolvidos
- `POST /logbook` - cria uma entrada de logbook para um exercicio
- `POST /sinclogbook` - sincroniza um ou mais exercicios

Exemplo `POST /logbook`:

```json
{
  "exercicio": "65f000000000000000000001",
  "carga": 45,
  "repeticoes": 9
}
```

Exemplo `POST /sinclogbook`:

```json
{
  "exercicios": ["65f000000000000000000001", "65f000000000000000000002"]
}
```

Resposta de sincronizacao:

- `sincronizados`: exercicios atualizados com sucesso
- `falhas`: lista de exercicios nao sincronizados com motivo

## Validacoes e regras importantes

- IDs Mongo invalidos retornam `422`
- corpo invalido retorna `422`
- recursos nao encontrados retornam `404`
- conflitos/regras de negocio podem retornar `400` ou `404` conforme implementacao atual das services

## Testes

Suite de testes de rotas em `__tests__/routes`.

O Jest carrega variaveis de `dotenv` a partir de `.env.test`. Crie esse arquivo se precisar de configuracoes especificas para testes.

Execucao padrao:

```bash
npm test
```

Se seu ambiente bloquear escrita de cache temporario, rode:

```bash
npx jest --runInBand --cacheDirectory .jest-cache
```
