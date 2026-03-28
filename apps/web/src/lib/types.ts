export type Produto = {
  id: number;
  nome: string;
  estoque: number;
  minimo: number;
};

export type Venda = {
  id: number;
  produto_id: number;
  quantidade: number;
  total: number;
  data: string;
};

export type Insight = {
  tipo: "sucesso" | "alerta" | "info";
  mensagem: string;
};