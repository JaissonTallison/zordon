# ZORDON — Documentação Técnica

> Este documento descreve a implementação atual do sistema (código-fonte real).
> Para a visão de produto/estratégia, veja o [README.md](../README.md) na raiz do projeto.

---

## 1. Visão Geral

ZORDON é um sistema de inteligência operacional: lê dados de produtos/vendas de
uma empresa, roda um conjunto de regras (motor de regras) sobre esses dados,
gera **decisões** (problemas, alertas, oportunidades, previsões) com impacto
financeiro estimado, prioriza essas decisões e notifica o frontend em tempo
real via WebSocket.

Monorepo com dois apps independentes:

```
zordon/
├── apps/
│   ├── api/   → Backend Node.js (Express + PostgreSQL + Socket.io)
│   └── web/   → Frontend React (Vite + Tailwind + Zustand)
└── docs/
```

---

## 2. Stack Tecnológica

### Backend (`apps/api`)
- Node.js (ESM, `"type": "module"`) + Express 5
- PostgreSQL via `pg` (SQL direto, sem ORM)
- Autenticação: JWT (`jsonwebtoken`) + `bcrypt`/`bcryptjs`
- Tempo real: `socket.io`
- Agendamento: `node-cron`
- Dev server: `nodemon`

### Frontend (`apps/web`)
- React 19 + Vite
- Roteamento: `react-router-dom` v7
- Estado global: `zustand`
- Estilo: Tailwind CSS
- Gráficos: `recharts`
- Animações: `framer-motion`
- Ícones: `lucide-react`
- Tempo real: `socket.io-client`

### Infra
- Docker Compose sobe apenas o PostgreSQL (`apps/api/docker-compose.yml`)

---

## 3. Como Rodar Localmente

### Banco de dados
```bash
cd apps/api
docker compose up -d          # sobe Postgres em localhost:5432 (db: zordon_db)
```

### API
```bash
cd apps/api
cp .env.example .env          # ajustar PORT, JWT_SECRET, DB_*
npm install
npm run dev                   # nodemon server.js → http://localhost:3333
```

Variáveis de ambiente (`apps/api/.env.example`):

| Variável      | Descrição                         |
|---------------|-------------------------------------|
| `PORT`        | Porta da API (padrão 3333)          |
| `JWT_SECRET`  | Segredo para assinar tokens JWT     |
| `DB_HOST`     | Host do PostgreSQL                  |
| `DB_PORT`     | Porta do PostgreSQL                 |
| `DB_USER`     | Usuário do banco                    |
| `DB_PASSWORD` | Senha do banco                      |
| `DB_NAME`     | Nome do banco                       |

Scripts do PostgreSQL para criar/atualizar o schema estão em
`apps/api/src/database/*.sql` (executar na ordem: `init.sql`, `empresas.sql`,
`users.sql`, `produtos.sql`, `vendas.sql`, `regras.sql`, demais `update_*.sql`
conforme necessário).

### Web
```bash
cd apps/web
npm install
npm run dev                   # Vite → http://localhost:5173
```

---

## 4. Arquitetura do Backend

```
src/
├── app.js                 → configuração do Express + montagem das rotas
├── server.js              → cria o HTTP server, conecta DB, sobe Socket.io
├── config/database.js     → pool de conexão PostgreSQL
├── middlewares/           → autenticar (JWT) / autorizar (por role)
├── routes/                → definição de endpoints por domínio
├── controllers/           → recebem req/res, chamam services
├── services/              → regras de negócio (engine, score, alertas, etc.)
├── repositories/          → acesso a dados (SQL direto via pg)
├── engine/                → motor de decisão (ver seção 6)
├── cron/                  → jobs agendados (node-cron)
└── database/              → scripts .sql de schema e seed
```

Fluxo típico de uma requisição:
`rota → middleware (autenticar/autorizar) → controller → service → repository → PostgreSQL`

### Autenticação e autorização
- `POST /api/auth/register` e `POST /api/auth/login` são as únicas rotas públicas.
- Login retorna um JWT contendo `id`, `email`, `role` e `empresa_id`.
- Middleware `autenticar` (`src/middlewares/auth.middleware.js`) exige header
  `Authorization: Bearer <token>` e popula `req.user`.
- Middleware `autorizar(role)` restringe rotas a uma role específica (ex.: `ADMIN`).
- Multi-tenant: todo dado é isolado por `empresa_id`, presente no token e usado
  em todas as queries dos repositories.

### Endpoints principais (`src/app.js`)

| Prefixo            | Proteção            | Arquivo de rotas              |
|--------------------|---------------------|--------------------------------|
| `/api/auth`        | público              | `auth.routes.js`               |
| `/api/engine`       | JWT                  | `engine.routes.js`             |
| `/api/invite`       | JWT + ADMIN          | `invite.routes.js`             |
| `/api/users`        | JWT + ADMIN          | `user.management.routes.js`    |
| `/api/audit`        | JWT + ADMIN          | `audit.routes.js`              |
| `/api/produtos`     | JWT                  | `produtos.routes.js`           |
| `/api/decisions`    | JWT                  | `decision.routes.js`           |
| `/api/resultados`   | JWT                  | `resultados.routes.js`         |
| `/api/regras`       | (ver nota abaixo)    | `regras.routes.js`             |

Detalhe dos endpoints de negócio mais relevantes:

**Engine** (`/api/engine`)
- `POST /executar` — dispara a engine (roda rules + regras dinâmicas, persiste resultados, emite eventos via socket)
- `GET /resultados` — lista resultados da última execução
- `GET /historico` — histórico de execuções
- `GET /intelligence` — camada de inteligência (tendências, previsões — ver `intelligence.service.js`)
- `GET /decisions` — decisões estruturadas e agrupadas
- `GET /score` — score operacional 0–100 (ver seção 7)
- `DELETE /resultados` — limpa resultados
- `PATCH /status/:id` — atualiza status de uma decisão (`PENDENTE` / `RESOLVIDO` / `IGNORADO`)

**Regras dinâmicas** (`/api/regras`)
- CRUD completo: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `PATCH /:id/toggle`, `DELETE /:id`
- Nota: diferente das outras rotas de negócio, `regras.routes.js` não aplica
  `autenticar` internamente — a proteção vem de `app.use("/api/regras", autenticar, regrasRoutes)`
  em `app.js`. Confirmar esse comportamento antes de expor publicamente.

**Produtos** (`/api/produtos`) — CRUD (`GET /`, `POST /`, `PUT /:id`, `DELETE /:id`)

**Decisões** (`/api/decisions`) — `POST /feedback` (feedback humano sobre decisões, usado para aprendizado)

---

## 5. WebSocket (tempo real)

Serviço: `src/services/socket.service.js`. Socket.io é anexado ao mesmo servidor
HTTP do Express (`src/server.js`), path `/ws`.

- Conexão exige `empresa_id` no handshake (`auth` ou `query`); sem isso o
  cliente é desconectado.
- Cada cliente entra na room `empresa:${empresa_id}` — isolamento multi-tenant
  a nível de socket.

Eventos emitidos pelo backend:

| Evento               | Quando é disparado                                  |
|-----------------------|------------------------------------------------------|
| `engine:executado`    | Após a engine rodar com sucesso                      |
| `engine:score`        | Novo score operacional calculado                     |
| `decisao:critica`     | Nova decisão com prioridade `CRITICA`                |
| `status:atualizado`   | Mudança de status de uma decisão                     |

Frontend consome via `apps/web/src/services/socket.js` (singleton) e o hook
`apps/web/src/hooks/useEngineRealtime.js`.

---

## 6. Motor de Decisão (Engine)

Núcleo em `src/engine/`:

```
engine/
├── engine.js                    → orquestrador principal
├── ruleEvaluator.js              → avalia regras dinâmicas vindas do DB
├── strategy/strategyEngine.js    → prioriza/ajusta relevância das decisões
├── analytics/
│   ├── trendAnalyzer.js          → tendências
│   ├── predictor.js              → previsões
│   └── scenarioSimulator.js      → simulação de cenários
├── alerts/alertEngine.js         → alertas operacionais
├── utils/
│   ├── scoreCalculator.js
│   ├── escalationCalculator.js
│   ├── resultBuilder.js
│   └── normalizer.js
└── rules/                        → regras "hardcoded" carregadas por arquivo
    ├── problems/produtoSemVendas.rule.js
    ├── problems/produtoParado.rule.js
    ├── alerts/estoqueBaixo.rule.js
    ├── opportunities/produtoAltoVenda.rule.js
    └── predictions/quedaVendas.prediction.js
```

### Regras baseadas em arquivo (`engine.js`)
- `carregarRules()` varre `engine/rules/{problems,alerts,opportunities,predictions}`
  e importa dinamicamente (`import()`) cada `.js` como módulo — cada arquivo
  exporta uma função default `(data) => resultado | resultado[]`.
- `engine(data)` executa todas as rules, concatena os resultados, ordena por
  prioridade (`CRITICO > ALTO > MEDIO > BAIXO`), depois por impacto financeiro,
  depois por score.
- O resultado agrupado (`problemas`, `alertas`, `oportunidades`, `previsoes`)
  é anexado como propriedade não-enumerável `_agrupado` (não aparece em JSON,
  não quebra `.map()`).

### Regras dinâmicas (banco de dados)
- Tabela `regras` (`src/database/regras.sql`), CRUD via `regras.controller.js`
  / `regras.repository.js`.
- `ruleEvaluator.js` avalia as condições (JSONB) de cada regra contra um
  contexto calculado por produto (campos como `diasSemVenda`, `estoque`,
  `minimo`, `valor`, `mediaVendas30d`, `mediaVendas90d`, `variacao`, `qtd30d`,
  `qtd90d`), usando operadores `>`, `>=`, `<`, `<=`, `=`, `!=`.
- A fórmula de impacto financeiro de cada regra é avaliada via `new Function`
  — regras dinâmicas rodam código definido pelo usuário; tratar como
  superfície de execução de código ao expor essa funcionalidade externamente.
- A engine roda regras de arquivo **e** regras dinâmicas do banco em conjunto.

### Cron (`src/cron/engine.cron.js`)
Job agendado (`node-cron`) para execução periódica automática da engine.

---

## 7. Score Operacional (0–100)

Serviço: `src/services/score.service.js` — endpoint `GET /api/engine/score`.

Fórmula:
```
score_operacional = (Impacto × 0.4) + (Urgência × 0.25) + (Recorrência × 0.2) + (Confiança × 0.15)
```

Retorno inclui `score_operacional`, `saude` (nível + cor), `dimensoes`,
`top_decisoes` e `impacto_total`. Consumido no frontend por um gauge SVG
animado na Home (`apps/web/src/pages/Home.jsx`).

---

## 8. Modelo de Dados (PostgreSQL)

Principais tabelas (scripts em `src/database/*.sql`):

| Tabela               | Descrição                                         |
|-----------------------|----------------------------------------------------|
| `empresas`             | Tenant — todo dado é isolado por `empresa_id`      |
| `users`                | Usuários, com `role` (ex.: `ADMIN`)                |
| `produtos`             | Catálogo de produtos por empresa                   |
| `vendas`               | Histórico de vendas por produto                    |
| `resultados`           | Decisões/resultados gerados pela engine, com `status` (`PENDENTE`/`RESOLVIDO`/`IGNORADO`) e `produto_nome` |
| `regras`               | Regras dinâmicas configuráveis pelo usuário         |
| `invites`              | Convites de novos usuários para uma empresa         |
| `audit` (log)          | Auditoria de ações, acessível apenas por `ADMIN`    |

Relações principais: `produtos → vendas` (1:N), `produtos → resultados` (1:N),
`empresas → tudo` (multi-tenant).

---

## 9. Arquitetura do Frontend

```
src/
├── App.jsx               → rotas (react-router-dom)
├── layout/MainLayout.jsx  → shell com NavigationRail + TopBar
├── pages/                 → uma página por rota
├── components/            → componentes reutilizáveis (decision, analytics, layout)
├── services/               → api.js (axios), socket.js, decision.services.js
├── store/                  → zustand (useAuthStore, useDecisionStore)
└── hooks/useEngineRealtime.js
```

### Rotas (`App.jsx`)
- Públicas: `/login`, `/register`
- Protegidas (exigem token no `localStorage`, via `ProtectedLayout`):
  `/` (Home), `/decisions`, `/produtos`, `/impacto`, `/inteligencia`,
  `/regras`, `/configuracoes`
- Proteção de rota é client-side (checa presença de token); a validação real
  do token acontece no backend a cada chamada de API.

### Estado
- `useAuthStore` (zustand) — sessão/usuário autenticado
- `useDecisionStore` (zustand) — decisões carregadas da engine
- `useEngineRealtime` — conecta ao socket e atualiza estado local a partir dos
  eventos `engine:executado`, `engine:score`, `decisao:critica`, `status:atualizado`

---

## 10. Pontos de Atenção Técnica

- **`new Function` em fórmulas de regra**: permite que qualquer usuário com
  acesso a `/api/regras` execute JS arbitrário no processo da API. Aceitável
  em ambiente controlado/interno; requer sandboxing antes de qualquer
  exposição multi-tenant não confiável.
- **CORS do Socket.io** está com `origin: "*"` — ajustar para o(s) domínio(s)
  reais antes de produção.
- **`autorizar(role)`** compara `role` exata (`req.user.role !== roleNecessaria`);
  não há hierarquia de roles — só suporta correspondência exata (ex.: `ADMIN`).
- Vários scripts `update_*.sql` soltos em `src/database/` sugerem que o schema
  evoluiu de forma incremental sem uma ferramenta de migração formal — vale
  considerar uma migration tool (ex.: `node-pg-migrate`) se o schema continuar crescendo.

---

## 11. Referência Cruzada

- Visão de produto, roadmap e modelo de negócio: [README.md](../README.md)
- Log de melhorias arquiteturais recentes (regras dinâmicas, score, WebSocket):
  memória de projeto `zordon-melhorias-implementadas` (2026-05-27).
