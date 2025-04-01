import { useAuthStore } from "~/stores/auth";
import { defineNuxtPlugin } from "#app";
import type { FetchOptions } from "ofetch";

// Define public routes that don't need auth handling
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/refresh",
  "/api/auth/verify",
  "/api/booking/get-config",
  "/api/booking/get-themes",
  "/api/booking/get-addons",
  "/api/booking/get-slots",
  "/api/booking/get-available-slots",
  "/api/booking/proceed",
  "/api/booking/receipt-detail",
];

export default defineNuxtPlugin(() => {
  return {
    provide: {
      apiFetch: async (url: string, options: any = {}) => {
        // Get fresh instance of auth store
        const auth = useAuthStore();

        // Ensure headers object exists
        options.headers = options.headers || {};

        // Add authorization header if we have a token and it's not a public route
        if (auth.token && !PUBLIC_ROUTES.includes(url)) {
          options.headers.Authorization = `Bearer ${auth.token}`;
          // console.log("Adding auth header for URL:", url);
          // console.log("Using token:", auth.token);
        }

        try {
          // console.log("Making request to:", url, "with options:", {
          //   ...options,
          //   headers: options.headers
          // });

          const response = await $fetch(url, {
            ...options,
            credentials: "include", // Include credentials in request
            headers: {
              ...options.headers,
              "Content-Type": "application/json",
            },
          });

          return response;
        } catch (error: any) {
          console.error("API request error for URL:", url, error);
          
          // Handle 401 errors
          if (error?.response?.status === 401 && !PUBLIC_ROUTES.includes(url)) {
            console.log("Unauthorized access, logging out");
            await auth.logout();
            navigateTo("/login");
          }
          throw error;
        }
      },
    },
  };
});
