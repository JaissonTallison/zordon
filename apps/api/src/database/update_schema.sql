-- ========================================
--  COLUNAS (SAFE)
-- ========================================

ALTER TABLE produtos
ADD COLUMN IF NOT EXISTS criado_em TIMESTAMP DEFAULT NOW();

ALTER TABLE vendas
ADD COLUMN IF NOT EXISTS criado_em TIMESTAMP DEFAULT NOW();

ALTER TABLE resultados
ADD COLUMN IF NOT EXISTS gerado_em TIMESTAMP DEFAULT NOW();

--  CRIAR SCORE SE NÃO EXISTIR
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='resultados' AND column_name='score'
  ) THEN
    ALTER TABLE resultados ADD COLUMN score NUMERIC;
  END IF;
END $$;

-- ========================================
--  FOREIGN KEYS (SAFE)
-- ========================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_produto_empresa'
  ) THEN
    ALTER TABLE produtos
    ADD CONSTRAINT fk_produto_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_venda_produto'
  ) THEN
    ALTER TABLE vendas
    ADD CONSTRAINT fk_venda_produto
    FOREIGN KEY (produto_id) REFERENCES produtos(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_venda_empresa'
  ) THEN
    ALTER TABLE vendas
    ADD CONSTRAINT fk_venda_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_resultado_empresa'
  ) THEN
    ALTER TABLE resultados
    ADD CONSTRAINT fk_resultado_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id);
  END IF;
END $$;

-- ========================================
--  ÍNDICES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_produtos_empresa
ON produtos(empresa_id);

CREATE INDEX IF NOT EXISTS idx_vendas_produto
ON vendas(produto_id);

CREATE INDEX IF NOT EXISTS idx_resultados_empresa
ON resultados(empresa_id);

CREATE INDEX IF NOT EXISTS idx_resultados_codigo
ON resultados(codigo);

-- ========================================
--  TIPAGEM SEGURA
-- ========================================

ALTER TABLE resultados
ALTER COLUMN impacto_valor TYPE NUMERIC
USING impacto_valor::NUMERIC;

ALTER TABLE resultados
ALTER COLUMN score TYPE NUMERIC
USING score::NUMERIC;