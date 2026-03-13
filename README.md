# Logbook API

API REST para gerenciamento de treinos por divisão, exercícios e logbooks de progresso, com autenticação via JWT.

## Visão geral

Esta API segue arquitetura em camadas:

- `routes`: entrada HTTP
- `middleware`: validação com Joi + autenticação JWT
- `services`: regras de negócio
- `repositories`: acesso ao MongoDB
- `models`: schemas Mongoose

Fluxo principal:

1. Cadastro de divisão de treino por dia.
2. Cadastro de exercícios vinculados a uma divisão.
3. Registro de performance no logbook.
4. Sincronização do logbook para atualizar os dados do exercício.
5. Registro de falhas inesperadas de sincronização em `LogErros`.

## Stack técnica

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
- Instância MongoDB disponível (Nuvem ou Docker)

## Instalação (local)

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz:

```env
PORT=8000
MONGO_URI=mongodb+srv://user:password@cluster0.ynyrkdn.mongodb.net/logbook (conexão atlas nuvem)
JWT_SECRET=sua_chave_jwt_forte
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
JWT_SECRET=sua_chave_jwt_forte
```

2. Suba os serviços:

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
|  |  |- loginValidationMiddleware.js
|  |  |- authMiddleware.js
|  |  |- idMongoMiddleware.js
|  |  |- logbookMiddleware.js
|  |  |- sinclogbookMiddleware.js
|  |  |- usuarioValidationMiddleware.js
|  |  |- validate.js
|  |- models/
|  |  |- dSchema.js
|  |  |- eSchema.js
|  |  |- lSchema.js
|  |  |- logErrosSchema.js
|  |  |- uSchema.js
|  |- repositories/
|  |  |- divisaoRepository.js
|  |  |- exercicioRepository.js
|  |  |- logbookRepository.js
|  |  |- usuarioRepository.js
|  |- routes/
|  |  |- divisao.js
|  |  |- exercicio.js
|  |  |- logbook.js
|  |  |- usuario.js
|  |- services/
|  |  |- divisaoService.js
|  |  |- exercicioService.js
|  |  |- logbookService.js
|  |  |- usuarioService.js
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

## Padrão de resposta

A API segue o formato:

```json
{
  "success": true,
  "data": {}
}
```

Em erro de validação (`422`), `data` retorna mensagens do Joi.

## Autenticação (JWT)

- Registre um usuário e faça login para obter o token.
- O token expira em **12h**.
- Para rotas protegidas, envie o header:

```http
Authorization: Bearer <seu_token>
```

### Registrar usuário

`POST /api/registrar`

Exemplo:

```json
{
  "nome": "Ana Silva",
  "email": "ana@exemplo.com",
  "senha": "1234"
}
```

### Login

`POST /api/logar`

Exemplo:

```json
{
  "email": "ana@exemplo.com",
  "senha": "1234"
}
```

Resposta (exemplo):

```json
{
  "success": true,
  "data": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Endpoints

Base path: `/api` (use o prefixo antes das rotas, e.g /api/divisoes)

### Autenticação (público)

- `POST /registrar` - cria usuário
- `POST /logar` - autentica usuário e retorna token

### Divisão (protegido)

- `GET /divisoes` - lista todas as divisões
- `GET /divisao/:id` - busca uma divisão por ID
- `POST /divisao` - cria uma divisão
- `DELETE /deletar_divisao/:id` - exclui uma divisão

Exemplo `POST /divisao`:

```json
{
  "nome": "Push 1",
  "dia": "Segunda"
}
```

Regras:

- `dia` deve ser um de: `Segunda`, `Terça`, `Quarta`, `Quinta`, `Sexta`, `Sábado`, `Domingo`
- não pode existir mais de uma divisão para o mesmo dia

### Exercício (protegido)

- `GET /exercicios` - lista exercícios
- `GET /exercicio/:id` - busca exercício por ID
- `POST /exercicio` - cria exercício e vincula a uma divisão
- `DELETE /deletar_exercicio/:id` - exclui exercício

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

### Logbook (protegido)

- `GET /logbooks` - lista logbooks
- `GET /logerros` - lista erros de sincronização não resolvidos
- `POST /logbook` - cria uma entrada de logbook para um exercício
- `POST /sinclogbook` - sincroniza um ou mais exercícios

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

Resposta de sincronização:

- `sincronizados`: exercícios atualizados com sucesso
- `falhas`: lista de exercícios não sincronizados com motivo

## Validações e regras importantes

- IDs Mongo inválidos retornam `422`
- corpo inválido retorna `422`
- recursos não encontrados retornam `404`
- conflitos/regras de negócio podem retornar `400` ou `404` conforme implementação atual das services

## Testes

Suite de testes de rotas em `__tests__/routes`.

O Jest carrega variáveis de `dotenv` a partir de `.env.test`. Crie esse arquivo se precisar de configurações específicas para testes.

Execução padrão:

```bash
npm test
```

Se seu ambiente bloquear escrita de cache temporário, rode:

```bash
npx jest --runInBand --cacheDirectory .jest-cache (Teste em paralelo)
npx jest divisao.test.js --runInBand --cacheDirectory .jest-cache (Teste específico)
```
