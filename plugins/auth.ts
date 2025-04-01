import { useAuthStore } from '~/stores/auth'

// Declare the type for initAuth
declare module '#app' {
  interface NuxtApp {
    $initAuth: () => Promise<boolean>
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()

  // Function to initialize auth
  const initializeAuth = async () => {
    try {
      // Initialize the store first
      auth.initialize()
      
      // Only try to fetch user if we have a token
      if (auth.token) {
        return await auth.fetchUser()
      }
      return false
    } catch (error) {
      console.error('Auth initialization failed:', error)
      return false
    }
  }

  // Initialize on client-side only
  if (process.client) {
    await initializeAuth()
  }

  // Provide the initialization function to the app
  return {
    provide: {
      initAuth: initializeAuth
    }
  }
}) 