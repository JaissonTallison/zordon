ALTER TABLE resultados
ADD COLUMN empresa_id INTEGER REFERENCES empresas(id);