<script setup>
definePageMeta({
  layout: "empty",
});

const auth = useAuthStore();

const form = reactive({
  username: "",
  password: "",
  remember: false,
});

const error = ref("");
const loading = ref(false);
const showPassword = ref(false);

const logo = ref("");
const isLogoLoading = ref(true);

const getConfig = async () => {
  try {
    const response = await $fetch("/api/booking/get-config");
    logo.value = response.logo;
  } finally {
    isLogoLoading.value = false;
  }
};

const handleSubmit = async () => {
  error.value = "";
  loading.value = true;

  try {
    if (!form.username || !form.password) {
      error.value = "All fields are required";
      return;
    }

    const success = await auth.login(form.username, form.password);
    if (success) {
      navigateTo("/dashboard");
    } else {
      error.value = auth.getError;
    }
  } catch (e) {
    console.error("Login error:", e);
    error.value = "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};

// Redirect if already logged in
onMounted(async () => {
  if (await auth.fetchUser()) {
    navigateTo("/dashboard");
  }

  getConfig();
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl"
    >
      <!-- Logo and Title -->
      <div>
        <!-- Logo -->
        <div class="flex justify-center">
          <div class="w-32 h-32">
            <div v-if="isLogoLoading" class="w-full h-full rounded-lg bg-gray-200 animate-pulse" />
            <img
              v-else
              :src="logo || 'https://stitchshutter.my/wp-content/uploads/2025/01/Path-15.svg'"
              alt="Logo"
              class="w-full h-full object-contain"
            />
          </div>
        </div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)] font-playfair"
        >
          Welcome back
        </h2>
        <p class="mt-2 text-center text-sm text-[var(--color-text-primary)]/70">
          Please sign in to your account
        </p>
      </div>

      <!-- Error Alert -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div v-if="error" class="rounded-lg bg-red-50 p-4 mt-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-[var(--color-error)]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-[var(--color-error)]">{{ error }}</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-[var(--color-text-primary)]"
              >Username</label
            >
            <div class="mt-1 relative rounded-lg shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-[var(--color-text-primary)]/40"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="username"
                v-model="form.username"
                type="text"
                autocomplete="username"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border-primary)] rounded-lg shadow-sm placeholder-[var(--color-text-primary)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-primary)] focus:border-[var(--color-border-primary)] sm:text-sm transition-colors duration-200"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-[var(--color-text-primary)]"
              >Password</label
            >
            <div class="mt-1 relative rounded-lg shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-[var(--color-text-primary)]/40"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="appearance-none block w-full pl-10 pr-10 py-2.5 border border-[var(--color-border-primary)] rounded-lg shadow-sm placeholder-[var(--color-text-primary)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-primary)] focus:border-[var(--color-border-primary)] sm:text-sm transition-colors duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <svg
                  class="h-5 w-5 text-[var(--color-text-primary)]/50 hover:text-[var(--color-text-primary)] transition-colors duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    v-if="!showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    v-if="!showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-if="showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-[var(--color-text-primary)] focus:ring-[var(--color-border-primary)]/20 border-[var(--color-border-primary)]/20 rounded transition-colors duration-200"
            />
            <label
              for="remember-me"
              class="ml-2 block text-sm text-[var(--color-text-primary)]"
              >Remember me</label
            >
          </div>

          <!-- <div class="text-sm">
            <a
              href="#"
              class="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              Forgot password?
            </a>
          </div> -->
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-dark)] hover:to-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-all duration-200 transform hover:scale-[1.02]"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>

          <div
            class="text-center text-sm text-[var(--color-text-primary)]/70 mt-4"
          >
            <NuxtLink
              to="/"
              class="hover:text-[var(--color-primary)] transition-colors duration-200"
              >Landing Page</NuxtLink
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style>
