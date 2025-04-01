import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    getUser: (state) => state.user,
    getError: (state) => state.error,
  },

  actions: {
    initialize() {
      if (process.server) return;

      const token = useCookie("token", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      if (token.value) {
        // console.log("Initializing with token from cookie:", token.value);
        this.token = token.value;
      }
      this.initialized = true;
    },

    async login(username, password) {
      this.loading = true;
      this.error = null;

      try {
        // console.log("Attempting login with:", { username });

        const { $apiFetch } = useNuxtApp();
        const response = await $apiFetch("/api/auth/login", {
          method: "POST",
          body: { username, password },
          headers: {
            "Content-Type": "application/json",
          }
        });

        // console.log("Login response:", response);

        if (response.status === "success" && response.data) {
          // console.log("Setting token:", response.data.token);
          
          const token = useCookie("token", {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });

          token.value = response.data.token;
          this.token = response.data.token;
          this.user = response.data.user;
          this.initialized = true;

          // Verify token was set correctly
          const storedToken = useCookie("token");
          // console.log("Stored token in cookie:", storedToken.value);
          // console.log("Stored token in state:", this.token);
          
          return true;
        }

        throw new Error(response.message || "Login failed");
      } catch (error) {
        console.error("Login error details:", error.response || error);
        this.error = error.response?.data?.message || error.message || "Failed to login";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      // First clear local state and cookies
      const token = useCookie("token");
      token.value = null;
      this.token = null;
      this.user = null;
      this.initialized = false;

      try {
        // Then try to logout from server
        const { $apiFetch } = useNuxtApp();
        await $apiFetch("/api/auth/logout", {
          method: "POST",
        }).catch((error) => {
          // Ignore server logout errors since we've already cleared local state
          console.warn("Server logout failed:", error);
        });
      } finally {
        // Ensure we navigate to login page
        if (process.client) {
          navigateTo("/login");
        }
      }
    },

    async fetchUser() {
      try {
        // Make sure we're initialized and have a token
        if (!this.initialized) {
          this.initialize();
        }

        // Double check token after initialization
        if (!this.token) {
          const token = useCookie("token");
          if (!token.value) {
            console.log("No token found in cookie");
            await this.logout();
            return false;
          }
          // console.log("Retrieved token from cookie:", token.value);
          this.token = token.value;
        }

        // console.log("Fetching user with token:", this.token);

        const { $apiFetch } = useNuxtApp();
        const response = await $apiFetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
          }
        });

        // console.log("User fetch response:", response);

        if (response.status === "success" && response.data) {
          this.user = response.data;
          return true;
        }

        console.log("Invalid response format:", response);
        await this.logout();
        return false;
      } catch (error) {
        console.error("Fetch user error:", error);
        console.error("Error response:", error.response);
        // Only logout if it's an auth error (401)
        if (error.response?.status === 401) {
          await this.logout();
        }
        return false;
      }
    },
  },
});
