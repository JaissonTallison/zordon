CREATE TABLE IF NOT EXISTS resultados (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20),
  codigo VARCHAR(50),
  produto_id INTEGER,
  titulo TEXT,
  descricao TEXT,
  impacto TEXT,
  prioridade VARCHAR(10),
  recomendacao JSONB,
  dados JSONB,
  gerado_em TIMESTAMP
);