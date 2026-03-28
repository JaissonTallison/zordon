"use client";

import { createProduto, updateProduto } from "@/src/lib/services/product.service";
import { Produto } from "@/src/lib/types";
import { useState, useEffect } from "react";


type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  produto?: Produto | null;
};

export function ProductModal({ open, onClose, onSuccess, produto }: Props) {
  const [nome, setNome] = useState("");
  const [estoque, setEstoque] = useState(0);
  const [minimo, setMinimo] = useState(0);
  const [loading, setLoading] = useState(false);

  // preencher dados ao editar
  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setEstoque(produto.estoque);
      setMinimo(produto.minimo);
    } else {
      setNome("");
      setEstoque(0);
      setMinimo(0);
    }
  }, [produto]);

  async function handleSubmit() {
    try {
      setLoading(true);

      if (!nome) {
        alert("Nome é obrigatório");
        return;
      }

      if (produto) {
        await updateProduto(produto.id, {
          nome,
          estoque,
          minimo,
        });
      } else {
        await createProduto({
          nome,
          estoque,
          minimo,
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 w-full max-w-md space-y-4">

        <h2 className="text-lg font-semibold">
          {produto ? "Editar Produto" : "Novo Produto"}
        </h2>

        {/* NOME */}
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
        />

        {/* ESTOQUE */}
        <input
          type="number"
          placeholder="Estoque"
          value={estoque}
          onChange={(e) => setEstoque(Number(e.target.value))}
          className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
        />

        {/* MÍNIMO */}
        <input
          type="number"
          placeholder="Mínimo"
          value={minimo}
          onChange={(e) => setMinimo(Number(e.target.value))}
          className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
        />

        {/* AÇÕES */}
        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>

        </div>

      </div>
    </div>
  );
}