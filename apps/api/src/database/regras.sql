-- =====================================================
-- ZORDON: Tabela de Regras Dinâmicas
-- Permite personalização de regras por empresa
-- sem necessidade de redeploy
-- =====================================================

CREATE TABLE IF NOT EXISTS regras (
  id               SERIAL PRIMARY KEY,
  empresa_id       INTEGER REFERENCES empresas(id) ON DELETE CASCADE,
  nome             VARCHAR(150)  NOT NULL,
  codigo           VARCHAR(100)  NOT NULL,
  tipo             VARCHAR(20)   NOT NULL CHECK (tipo IN ('problema', 'alerta', 'oportunidade', 'previsao')),
  ativa            BOOLEAN       DEFAULT true,
  prioridade       VARCHAR(20)   DEFAULT 'MEDIA' CHECK (prioridade IN ('CRITICA', 'ALTA', 'MEDIA', 'BAIXA')),
  condicoes        JSONB         NOT NULL,
  impacto_formula  VARCHAR(255),                   -- ex: "valor * estoque"
  titulo_template  VARCHAR(200),
  descricao_template VARCHAR(500),
  recomendacao_template TEXT,
  peso             DECIMAL(4,2)  DEFAULT 1.0,
  escopo           VARCHAR(20)   DEFAULT 'produto' CHECK (escopo IN ('produto', 'venda', 'global')),
  criado_em        TIMESTAMP     DEFAULT NOW(),
  atualizado_em    TIMESTAMP     DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regras_empresa      ON regras(empresa_id);
CREATE INDEX IF NOT EXISTS idx_regras_ativa        ON regras(empresa_id, ativa);
CREATE INDEX IF NOT EXISTS idx_regras_tipo         ON regras(tipo);

-- Trigger para atualizar atualizado_em
CREATE OR REPLACE FUNCTION set_regras_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_regras_atualizado
  BEFORE UPDATE ON regras
  FOR EACH ROW EXECUTE FUNCTION set_regras_atualizado_em();

-- =====================================================
-- SEED: Regras padrão para empresa_id = 1
-- (Espelho das regras hardcoded existentes, mas agora no DB)
-- =====================================================

INSERT INTO regras (empresa_id, nome, codigo, tipo, prioridade, escopo, condicoes, impacto_formula, titulo_template, descricao_template, recomendacao_template)
VALUES
  (
    1,
    'Produto Parado',
    'PRODUTO_PARADO_DB',
    'problema',
    'ALTA',
    'produto',
    '{"operador":"AND","condicoes":[{"campo":"diasSemVenda","op":">","valor":30},{"campo":"estoque","op":">","campo2":"minimo"}]}',
    'valor * estoque',
    '{nome} parado há {diasSemVenda} dias',
    '{nome} está há {diasSemVenda} dias sem vendas com R$ {impacto_valor} em capital parado',
    'Criar campanha promocional ou aplicar desconto de 15-20%'
  ),
  (
    1,
    'Estoque Crítico',
    'ESTOQUE_CRITICO_DB',
    'alerta',
    'ALTA',
    'produto',
    '{"operador":"AND","condicoes":[{"campo":"estoque","op":"<=","campo2":"minimo"},{"campo":"estoque","op":">","valor":0}]}',
    'valor * minimo * 2',
    'Estoque crítico: {nome}',
    '{nome} está com estoque {estoque} abaixo do mínimo de {minimo} unidades',
    'Solicitar reposição imediata ao fornecedor'
  ),
  (
    1,
    'Produto sem Estoque',
    'PRODUTO_SEM_ESTOQUE_DB',
    'problema',
    'CRITICA',
    'produto',
    '{"operador":"AND","condicoes":[{"campo":"estoque","op":"=","valor":0}]}',
    'valor * 30 * 0.3',
    'Ruptura de estoque: {nome}',
    '{nome} está com estoque zerado — perda de vendas estimada de R$ {impacto_valor}',
    'Contatar fornecedor com urgência e verificar produtos substitutos'
  ),
  (
    1,
    'Alta Demanda',
    'PRODUTO_ALTA_DEMANDA_DB',
    'oportunidade',
    'ALTA',
    'produto',
    '{"operador":"AND","condicoes":[{"campo":"mediaVendas30d","op":">","campo2":"mediaVendas90d","multiplicador":1.3}]}',
    'valor * mediaVendas30d * 0.2',
    'Oportunidade: {nome} em alta',
    '{nome} teve crescimento de {variacao}% nas últimas semanas — oportunidade de maximizar margem',
    'Aumentar estoque estratégico e considerar ajuste de preço'
  ),
  (
    1,
    'Tendência de Queda',
    'QUEDA_TENDENCIA_DB',
    'alerta',
    'MEDIA',
    'produto',
    '{"operador":"AND","condicoes":[{"campo":"mediaVendas30d","op":"<","campo2":"mediaVendas90d","multiplicador":0.7}]}',
    'valor * mediaVendas90d * 0.15',
    'Queda de demanda: {nome}',
    '{nome} com queda de {variacao}% nas vendas nos últimos 30 dias',
    'Investigar causa da queda e avaliar promoções ou descontinuação'
  )
ON CONFLICT DO NOTHING;
