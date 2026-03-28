import { apiFetch } from "../api";
import { Produto } from "../types";

export function getProdutos(): Promise<Produto[]> {
  return apiFetch("/api/produtos");
}

export function createProduto(data: Partial<Produto>) {
  return fetch("http://localhost:3333/api/produtos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export function updateProduto(id: number, data: Partial<Produto>) {
  return fetch(`http://localhost:3333/api/produtos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export function deleteProduto(id: number) {
  return fetch(`http://localhost:3333/api/produtos/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}