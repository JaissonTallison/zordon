ALTER TABLE users
ADD COLUMN empresa_id INTEGER REFERENCES empresas(id);