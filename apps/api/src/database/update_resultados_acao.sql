-- Registra qual ação o gestor escolheu ao resolver uma decisão
-- (ex: criar promoção, pedir desconto ao fornecedor, solicitar reposição...)
ALTER TABLE resultados ADD COLUMN IF NOT EXISTS acao_aplicada TEXT;
