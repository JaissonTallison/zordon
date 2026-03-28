import { apiFetch } from "../api";
import { Venda } from "../types";

export async function getVendas(): Promise<Venda[]> {
  return apiFetch("/vendas");
}