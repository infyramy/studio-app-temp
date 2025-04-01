import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware on server-side
  if (process.server) return;

  const auth = useAuthStore();

  // Initialize auth store if needed
  if (!auth.initialized) {
    auth.initialize();
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/book-a-session", "/login", "/register"];

  // If it's a public route, allow access
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // For protected routes, always try to fetch user data if we have a token
  if (auth.token) {
    const success = await auth.fetchUser();
    if (!success) {
      const redirectTo = useCookie("redirect_to", { maxAge: 300 }); // 5 minutes
      redirectTo.value = to.fullPath;
      return navigateTo("/login");
    }
  } else {
    // No token found, redirect to login
    const redirectTo = useCookie("redirect_to", { maxAge: 300 }); // 5 minutes
    redirectTo.value = to.fullPath;
    return navigateTo("/login");
  }

  // If we reach here, user is authenticated
  if (to.path === "/login" || to.path === "/register") {
    return navigateTo("/dashboard");
  }
});
