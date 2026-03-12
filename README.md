# ZORDON

**ZORDON** é um sistema de análise de vendas e geração de insights desenvolvido para auxiliar gestores e pequenos negócios na tomada de decisões estratégicas no setor comercial.

O sistema analisa dados de vendas, identifica padrões de comportamento dos produtos e gera recomendações que ajudam a melhorar o desempenho das vendas, otimizar o estoque e apoiar decisões comerciais.

---

# Problema

Muitos pequenos negócios registram suas vendas, porém **não utilizam esses dados para análise estratégica**. Isso pode gerar diversos problemas como:

* compra excessiva de produtos que não vendem
* falta de produtos com alta demanda
* dificuldade para identificar tendências de venda
* ausência de indicadores para tomada de decisão

Sem análise adequada, os dados de vendas acabam sendo apenas registros históricos e **não contribuem para a gestão do negócio**.

---

# Solução

O **ZORDON** transforma dados de vendas em **informações estratégicas**.

Através da análise periódica das vendas registradas, o sistema identifica:

* produtos mais vendidos
* produtos com baixa saída
* produtos sem vendas no período
* alertas de estoque baixo
* recomendações de ações comerciais

Essas informações são apresentadas ao usuário em forma de **insights**, ajudando a melhorar o planejamento de vendas e estoque.

---

# Funcionalidades

O sistema possui as seguintes funcionalidades principais:

### Gestão de Produtos

* cadastro de produtos
* edição de produtos
* controle de estoque
* definição de estoque mínimo

### Registro de Vendas

* registro de vendas realizadas
* histórico de vendas
* cálculo automático do valor total

### Análise de Desempenho

* análise periódica das vendas
* classificação de produtos por desempenho
* identificação de padrões de venda

### Geração de Insights

* identificação de produtos mais vendidos
* identificação de produtos com baixa saída
* alerta de estoque baixo
* sugestão de ações comerciais

---

# Arquitetura do Sistema

O projeto segue uma arquitetura baseada em **API REST** e **separação de responsabilidades**, utilizando princípios de **SOLID**.

Fluxo da aplicação:

Cliente
↓
Routes
↓
Controllers
↓
Services (regras de negócio)
↓
Repositories
↓
Banco de Dados (PostgreSQL)

Essa estrutura facilita:

* manutenção do código
* escalabilidade do sistema
* organização das regras de negócio

---

# Estrutura do Projeto

```
zordon
│
├ src
│  ├ controllers
│  ├ services
│  ├ repositories
│  ├ entities
│  ├ routes
│  ├ config
│  ├ jobs
│  └ utils
│
├ docker
├ docs
├ tests
│
├ docker-compose.yml
├ package.json
├ tsconfig.json
├ README.md
└ .gitignore
```

---

# Modelo de Banco de Dados

O sistema utiliza **PostgreSQL**.

Principais entidades:

### Products

Armazena informações dos produtos cadastrados.

| Campo      | Tipo      |
| ---------- | --------- |
| id         | uuid      |
| name       | varchar   |
| category   | varchar   |
| price      | decimal   |
| cost       | decimal   |
| stock      | integer   |
| min_stock  | integer   |
| created_at | timestamp |

---

### Sales

Armazena registros de vendas.

| Campo          | Tipo      |
| -------------- | --------- |
| id             | uuid      |
| product_id     | uuid      |
| quantity       | integer   |
| unit_price     | decimal   |
| total_value    | decimal   |
| payment_method | varchar   |
| created_at     | timestamp |

---

### Insights

Armazena recomendações geradas pelo sistema.

| Campo       | Tipo      |
| ----------- | --------- |
| id          | uuid      |
| product_id  | uuid      |
| type        | varchar   |
| description | text      |
| created_at  | timestamp |

Tipos de insight possíveis:

* HIGH_DEMAND
* LOW_DEMAND
* LOW_STOCK
* NO_SALES

---

# Tecnologias Utilizadas

Backend:

* Node.js
* Express
* TypeScript

Banco de dados:

* PostgreSQL

Infraestrutura:

* Docker
* Docker Compose

Arquitetura e boas práticas:

* API REST
* SOLID
* Clean Architecture

---

# Funcionamento da Análise de Vendas

O ZORDON executa análises periódicas das vendas registradas.

O processo funciona da seguinte forma:

1️⃣ Coleta das vendas do período analisado
2️⃣ Agrupamento das vendas por produto
3️⃣ Cálculo da quantidade total vendida
4️⃣ Comparação com média de vendas
5️⃣ Verificação do nível de estoque
6️⃣ Geração de insights automáticos

Exemplo de resultado:

```
Relatório ZORDON

Período analisado: 7 dias

Produto mais vendido:
Café Premium (120 unidades)

Produto com baixa saída:
Chá Verde (3 unidades)

Alertas:
Estoque baixo de açúcar

Recomendações:
Aumentar estoque de café
Criar promoção para chá verde
```

---

# Executando o Projeto com Docker

Em breve será possível executar o projeto utilizando Docker.

```
docker-compose up
```

Isso iniciará:

* API Node.js
* Banco PostgreSQL

---

# Objetivo Acadêmico

Este projeto foi desenvolvido com fins acadêmicos para aplicar conceitos de:

* desenvolvimento backend
* arquitetura de software
* análise de dados de vendas
* modelagem de banco de dados
* containerização de aplicações

---

# Possíveis Melhorias Futuras

Algumas evoluções possíveis do sistema:

* dashboard com gráficos
* análise preditiva de vendas
* integração com sistemas de PDV
* sistema de recomendação de produtos
* notificações automáticas

---

# Autor

Desenvolvido por **Jaisson Tallison**.

---

# Licença

Este projeto está sob a licença **MIT**.
