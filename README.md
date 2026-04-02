# ZORDON

Sistema de inteligência operacional para análise contínua de dados empresariais, com foco na identificação de problemas, priorização de ações e geração de decisões acionáveis.

---

# 1. Visão Estratégica

O ZORDON é um sistema projetado para transformar dados operacionais em decisões estruturadas, atuando de forma contínua sobre o ambiente do negócio.

Diferente de ferramentas tradicionais de Business Intelligence, que exigem interpretação humana, o ZORDON atua de forma ativa:

- Analisa dados automaticamente
- Identifica problemas
- Calcula impacto financeiro
- Sugere ações

---

# 2. Problema Abordado

Empresas possuem dados, mas enfrentam dificuldades em:

- Identificar problemas operacionais em tempo real  
- Priorizar ações com base em impacto financeiro  
- Transformar dados em decisões práticas  
- Reduzir dependência de análise manual  

---

# 3. Proposta do Sistema

O ZORDON atua como um sistema de inteligência operacional que:

- Monitora dados continuamente  
- Detecta padrões e anomalias  
- Identifica problemas operacionais  
- Avalia impacto financeiro  
- Recomenda ações estruturadas  

---

# 4. Funcionamento

Fluxo principal:

Entrada de Dados -> Engine -> Regras -> Decisoes -> Priorizacao -> Acao


---

# 5. Arquitetura do Sistema

## Modelo

Monolito modular com separação por responsabilidade.

## Estrutura

zordon/
    apps/
       api/ -> Backend (Node.js)
       web/ -> Frontend (React)
    docs/
    infra/



## Camadas

### Interface
Responsável pela interação com o usuário.

### API
Orquestração das operações.

### Core (Domínio)
- Engine de decisão
- Motor de regras
- Estratégia
- Analytics

### Data Layer
Persistência (PostgreSQL)

---

# 6. Núcleo do Sistema

## Engine de Decisão
Executa análise completa dos dados.

## Motor de Regras
Executa regras como:

- Produto sem vendas
- Produto parado
- Estoque baixo
- Alta demanda

## Strategy Layer
Simula comportamento de gestor:
- prioriza decisões
- ajusta relevância

## Analytics
- Tendências
- Previsões
- Simulação de cenários

---

# 7. Modelagem de Dados

Banco: PostgreSQL

### Entidades principais:

- empresas
- users
- produtos
- vendas
- resultados
- decision_feedback
- alertas
- actions

### Relacionamentos:

- Produto → Vendas (1:N)
- Produto → Resultados (1:N)
- Empresa → Tudo (multi-tenant)

---

# 8. Modelo de Regras

Estrutura padrão:

Condicao + Contexto + Impacto + Recomendacao


Exemplo:

- Condição: Produto sem vendas  
- Impacto: Capital parado  
- Recomendação: Criar campanha  

---

# 9. Estado Atual do Sistema (IMPLEMENTADO)

## Backend

✔ Engine completa funcionando  
✔ Motor de regras modular (filesystem-based)  
✔ Sistema de impacto financeiro  
✔ Persistência de decisões  
✔ Recorrência de problemas  
✔ Sistema de status (PENDENTE, RESOLVIDO, IGNORADO)  
✔ API protegida com JWT  

## Frontend

✔ Dashboard de decisões  
✔ Tela de impacto financeiro  
✔ Ranking de impacto  
✔ Visualização por prioridade  
✔ Integração com API  

## Infraestrutura

✔ Docker configurado  
✔ PostgreSQL em container  
✔ Estrutura pronta para deploy  

---

# 10. Funcionalidades Atuais

- Execução manual da engine  
- Detecção de problemas operacionais  
- Cálculo de impacto financeiro  
- Ranking de decisões  
- Persistência histórica  
- Interface visual com dados reais  

---

# 11. Níveis de Informação

### Operacional
Dados brutos (produtos, vendas)

### Analítico
Problemas detectados

### Estratégico
Decisões acionáveis

---

# 12. Nicho de Aplicação

Foco inicial:

- Pequenas e médias empresas
- Varejo
- E-commerce

---

# 13. Diferenciação

O ZORDON diferencia-se por:

- Execução contínua  
- Decisão estruturada  
- Impacto financeiro real  
- Foco em ação (não só análise)  

---

# 14. Segurança

- Autenticação via JWT  
- Isolamento por empresa (multi-tenant ready)  
- Controle de acesso por usuário  

---

# 15. Stack Tecnológica

## Backend
- Node.js
- Express

## Banco
- PostgreSQL

## Acesso a dados
- node-postgres (SQL direto)

## Frontend
- React
- Tailwind CSS

## Infra
- Docker
- Docker Compose

## Versionamento
- Git + GitHub

---

# 16. Execução

## Backend

cd apps/api
npm install
npm run dev

## Frontend

cd apps/web
npm install
npm run dev


---

# 17. Roadmap (PRÓXIMOS PASSOS)

## Curto prazo

- Ações automáticas (executar decisões)
- Botão "resolver" no frontend
- Feedback de decisões (aprendizado)
- Melhorar descrição das decisões

## Médio prazo

- Sistema de notificações
- Dashboard executivo completo
- Agrupamento inteligente de decisões
- Métricas de performance

## Longo prazo

- IA para geração de estratégias
- Integração com ERP
- Sistema de recomendação avançado
- Automação completa (self-driving business)

---

# 18. Modelo de Negócio

SaaS baseado em assinatura:

- Plano Básico
- Plano Profissional
- Plano Enterprise

---

# 19. Processamento Contínuo

O sistema suporta execução automática via:

- cron jobs
- análise periódica
- geração de alertas

---

# 20. Status do Projeto

🚧 Em desenvolvimento avançado

- Core funcional
- Backend estável
- Frontend evoluindo
- Pronto para validação real

---

# 21. Desenvolvedores

- Jaisson Tallison  
- Iara  
- Heverton  
- Fernando  

---

# 22. Conclusão

O ZORDON representa uma mudança de paradigma:

De:
→ sistemas que mostram dados  

Para:
→ sistemas que tomam decisões  

O objetivo é reduzir a dependência humana na análise operacional e transformar dados em ação direta.

---
