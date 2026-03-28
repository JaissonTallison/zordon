import { apiFetch } from "../api";
import { Insight } from "../types";

export async function getInsights(): Promise<Insight[]> {
  return apiFetch("/insights");
}