import { create } from "zustand";
import api from "../services/api";

export const useDecisionStore = create((set) => ({
  decisions: [],
  loading: false,

  fetchDecisions: async () => {
    set({ loading: true });

    try {
      const response = await api.get("/engine/resultados");

      set({
        decisions: response.data,
        loading: false
      });
    } catch (err) {
      console.error("Erro ao buscar decisões:", err);
      set({ loading: false });
    }
  }
}));