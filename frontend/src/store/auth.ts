import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) =>
      state.user?.role === "admin" || state.user?.role === "superadmin",
    isSuperAdmin: (state) => state.user?.role === "superadmin",
  },
  actions: {
    async login(credentials: any) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/auth/login", credentials);
        const { access_token, user } = response.data;

        this.token = access_token;
        this.user = user;

        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Login failed";
        return false;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
