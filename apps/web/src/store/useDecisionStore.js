import { create } from "zustand";
import api from "../services/api";


const useDecisionStore = create((set) => ({
  decisions: [],
  loading: false,

  fetchDecisions: async () => {
    set({ loading: true });

    try {
      const response = await api.get("/decisions");

      set({ decisions: response.data });
    } catch (err) {
      console.error("Erro ao buscar decisões:", err);
    } finally {
      set({ loading: false });
    }
  },

  applyDecision: async (id) => {
    try {
      await api.post(`/decisions/${id}/feedback`, {
        status: "aplicado",
      });

      set((state) => ({
        decisions: state.decisions.map((d) =>
          d.id === id
            ? { ...d, status_execucao: "aplicado" }
            : d
        ),
      }));
    } catch (err) {
      console.error("Erro ao aplicar decisão:", err);
    }
  },

  ignoreDecision: async (id) => {
    try {
      await api.post(`/decisions/${id}/feedback`, {
        status: "ignorado",
      });

      set((state) => ({
        decisions: state.decisions.map((d) =>
          d.id === id
            ? { ...d, status_execucao: "ignorado" }
            : d
        ),
      }));
    } catch (err) {
      console.error("Erro ao ignorar decisão:", err);
    }
  },
}));

export default useDecisionStore;