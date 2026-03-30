import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,

  login: async (email, senha) => {
    const res = await api.post("/auth/login", {
      email,
      senha
    });

    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({ user: null });

    window.location.href = "/login"; 
  }
}));

export default useAuthStore;