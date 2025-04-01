<script setup lang="ts">
definePageMeta({
  layout: "empty",
});

interface ApiResponse {
  statusCode: number;
  message?: string;
  data?: {
    title?: string;
    description?: string;
    buttonText?: string;
    redirectUrl?: string;
    companyName?: string;
    ssmNumber?: string;
    companyAddress?: string;
    adminPhoneNumber?: string;
    lpImg1?: string;
    lpImg2?: string;
    lpImg3?: string;
  };
}

const currentImageIndex = ref(0);
const router = useRouter();
const route = useRoute();
const { $apiFetch } = useNuxtApp();

// Add initial loading state
const isInitialLoading = ref(true);
const isContentMounted = ref(false);

const referral = ref(route.query.ref);
console.log("Referral:", referral.value);

const images = ref<string[]>([]);

// Loading states
const { data: pageData, pending: isLoading } = useAsyncData(
  "landing-page",
  async () => {
    try {
      const response = (await $apiFetch(
        "/api/setting/get-landing-page"
      )) as ApiResponse;
      return response.data || {};
    } catch (error) {
      console.error("Error fetching landing page:", error);
      return {};
    }
  },
  {
    // Ensure loading state shows first
    immediate: true,
  }
);

// Reactive refs from pageData
const title = computed(() => pageData.value?.title || "");
const description = computed(() => pageData.value?.description || "");
const buttonText = computed(() => pageData.value?.buttonText || "");
const redirectUrl = computed(() => pageData.value?.redirectUrl || "");
const companyName = computed(() => pageData.value?.companyName || "");
const ssmNumber = computed(() => pageData.value?.ssmNumber || "");
const companyAddress = computed(() => pageData.value?.companyAddress || "");
const adminPhoneNumber = computed(() => pageData.value?.adminPhoneNumber || "");

// Image loading states
const imagesLoaded = ref(false);
const imageLoadingStates = ref<boolean[]>([false, false, false]);

watchEffect(() => {
  if (pageData.value) {
    images.value = [
      pageData.value.lpImg1 || "",
      pageData.value.lpImg2 || "",
      pageData.value.lpImg3 || "",
    ].filter(Boolean);
  }
});

function onImageLoad(index: number) {
  imageLoadingStates.value[index] = true;
  if (imageLoadingStates.value.every((state) => state)) {
    imagesLoaded.value = true;
  }
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
}

function prevImage() {
  currentImageIndex.value =
    currentImageIndex.value === 0
      ? images.value.length - 1
      : currentImageIndex.value - 1;
}

function navigateToBooking() {
  if (referral.value) {
    navigateTo(`/book-a-session?ref=${referral.value}`);
  } else {
    navigateTo("/book-a-session");
  }
}

function navigateToAdminLogin() {
  navigateTo("/login");
}

function navigateToReturnPolicy() {
  navigateTo("/return-refund-policy");
}

function navigateToPrivacyPolicy() {
  navigateTo("/privacy-policy");
}

function navigateSecondButton() {
  window.open(redirectUrl.value, "_blank");
}

onMounted(() => {
  // Show initial loading state
  setTimeout(() => {
    isInitialLoading.value = false;
    isContentMounted.value = true;
  }, 1500);

  // Auto-advance slideshow
  setInterval(nextImage, 5000);
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#1A1A1A]">
    <!-- Initial Loading Overlay -->
    <div
      v-if="isInitialLoading || isLoading"
      class="fixed inset-0 bg-[#1A1A1A] z-50 flex items-center justify-center overflow-hidden"
    >
      <!-- Background Pattern -->
      <div
        class="absolute inset-0 pattern-islamic opacity-[0.02] pointer-events-none"
      ></div>

      <div
        class="relative flex flex-col items-center gap-8 px-4 max-w-sm mx-auto text-center"
      >
        <div class="p-2 x-[500px]"></div>

        <!-- Loading Bar -->
        <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            class="h-full w-full bg-[var(--color-primary-light)] rounded-full origin-left animate-loading-progress"
          ></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <Transition name="content-fade" mode="out-in">
      <main v-if="isContentMounted && !isLoading" class="flex-1 flex flex-col relative">
        <!-- Decorative Pattern -->
        <div
          class="absolute inset-0 pattern-islamic opacity-[0.02] pointer-events-none"
        ></div>

        <!-- Hero Section -->
        <div class="relative flex-1 flex items-center">
          <!-- Image Slider -->
          <div class="absolute inset-0 overflow-hidden">
            <transition-group name="fade">
              <div
                v-for="(image, index) in images"
                :key="image"
                v-show="currentImageIndex === index"
                class="absolute inset-0"
              >
                <!-- Skeleton loader -->
                <div
                  v-if="!imageLoadingStates[index]"
                  class="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 animate-pulse"
                ></div>
                <img
                  :src="image"
                  :alt="'Studio Photo ' + (index + 1)"
                  class="w-full h-full object-cover"
                  @load="onImageLoad(index)"
                  :class="{ 'opacity-0': !imageLoadingStates[index] }"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 to-transparent"
                ></div>
              </div>
            </transition-group>
          </div>

          <!-- Content -->
          <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div class="max-w-2xl">
              <!-- Decorative Element -->
              <div class="flex items-center gap-4 mb-8">
                <div class="h-[2px] w-12 bg-[var(--color-primary-light)]"></div>
                <span
                  class="text-[var(--color-primary-light)] tracking-wider text-sm font-medium"
                  >HARI RAYA 2025</span
                >
              </div>

              <template v-if="!isLoading">
                <h1
                  class="font-bodoni-moda italic font-normal text-4xl sm:text-6xl md:text-7xl text-white leading-none mb-4 sm:mb-6"
                >
                  <!-- <span class="block mb-2">Capture Your</span> -->
                  <span class="block text-white">{{ title }}</span>
                </h1>

                <p
                  class="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-xl"
                >
                  {{ description }}
                </p>
              </template>
              <template v-else>
                <!-- Title skeleton -->
                <div
                  class="h-20 bg-white/10 rounded-lg animate-pulse mb-4 sm:mb-6"
                ></div>
                <!-- Description skeleton -->
                <div class="space-y-2 mb-8 sm:mb-12">
                  <div class="h-6 bg-white/10 rounded animate-pulse"></div>
                  <div
                    class="h-6 bg-white/10 rounded animate-pulse w-3/4"
                  ></div>
                </div>
              </template>

              <div
                class="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
              >
                <button
                  @click="navigateToBooking"
                  class="group relative w-full sm:w-64 px-6 sm:px-8 py-4 bg-[var(--color-primary-light)] text-white rounded-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[var(--color-primary-light)]/20"
                >
                  <span
                    class="relative z-10 flex items-center justify-center gap-3 text-base sm:text-lg font-medium tracking-wide"
                  >
                    Book a Session
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <div
                    class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
                  ></div>
                </button>

                <button
                  @click="navigateSecondButton"
                  class="group relative w-full sm:w-64 px-6 sm:px-8 py-4 border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white rounded-xl overflow-hidden transform hover:scale-[1.02] hover:border-[var(--color-primary-light)] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span
                    class="relative z-10 flex items-center justify-center gap-3 text-base sm:text-lg font-medium tracking-wide group-hover:text-[var(--color-primary-light)]"
                  >
                    {{ buttonText }}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SSM Information -->
        <div class="absolute bottom-0 left-0 right-0 w-full">
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent -z-10"></div>
          
          <div class="w-full py-4 lg:py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <template v-if="!isLoading">
                <!-- Company Info -->
                <div class="space-y-1 mb-3 backdrop-blur-sm">
                  <h3 class="text-white/90 font-medium text-sm sm:text-base">
                    {{ companyName }}
                  </h3>
                  <div
                    class="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-white/80 text-xs sm:text-sm"
                  >
                    <p>SSM {{ ssmNumber }}</p>
                    <div class="hidden sm:block text-white/60">|</div>
                    <p>{{ companyAddress }}</p>
                    <div class="hidden sm:block text-white/60">|</div>
                    <div
                      class="hover:text-[var(--color-primary-light)] transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {{ adminPhoneNumber }}
                    </div>
                  </div>
                </div>

                <!-- Links -->
                <!-- <div class="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                  <button
                    @click="navigateToReturnPolicy"
                    class="text-white/80 hover:text-[var(--color-primary-light)] transition-colors duration-200 underline underline-offset-2"
                  >
                    Return & Refund Policy
                  </button>
                  <span class="text-white/60">|</span>
                  <button
                    @click="navigateToPrivacyPolicy"
                    class="text-white/80 hover:text-[var(--color-primary-light)] transition-colors duration-200 underline underline-offset-2"
                  >
                    Privacy Policy
                  </button>
                </div> -->
              </template>
              <template v-else>
                <!-- Loading Skeleton -->
                <div class="space-y-3 backdrop-blur-sm">
                  <div class="space-y-1">
                    <div class="h-5 bg-white/10 rounded animate-pulse w-40"></div>
                    <div
                      class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-3"
                    >
                      <div class="h-4 bg-white/10 rounded animate-pulse w-24"></div>
                      <div class="hidden sm:block text-white/40">|</div>
                      <div class="h-4 bg-white/10 rounded animate-pulse w-48"></div>
                      <div class="hidden sm:block text-white/40">|</div>
                      <div class="h-4 bg-white/10 rounded animate-pulse w-32"></div>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <div class="h-4 bg-white/10 rounded animate-pulse w-32"></div>
                    <div class="text-white/40">|</div>
                    <div class="h-4 bg-white/10 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </main>
    </Transition>

    <!-- Admin Login Link -->
    <!-- <div class="fixed bottom-4 sm:bottom-8 right-4 sm:right-8">
      <button
        @click="navigateToAdminLogin"
        class="group px-3 sm:px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 text-xs sm:text-sm flex items-center gap-2 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 group-hover:rotate-12 transition-transform"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
        Admin Login
      </button>
    </div> -->
  </div>
</template>

<style scoped>
/* Add Bodoni Moda font */
@import url("https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Geist:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap");

.pattern-islamic {
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C3A455' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.content-fade-enter-active,
.content-fade-leave-active {
  transition: opacity 0.8s ease;
}

.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@font-face {
  font-family: "Raya";
  src: url("/fonts/your-special-font.woff2") format("woff2");
}


.font-bodoni-moda {
  font-family: "Bodoni Moda", serif;
  font-style: italic;
  font-weight: 400;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes scale-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px 2px var(--color-primary-light);
    opacity: 0.5;
  }
  50% {
    box-shadow: 0 0 30px 4px var(--color-primary-light);
    opacity: 0.8;
  }
}

.animate-scale-pulse {
  animation: scale-pulse 2s ease-in-out infinite;
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 2s linear infinite;
}

/* Gradient animation for the loading text */
.gradient-text {
  background: linear-gradient(
    to right,
    var(--color-primary-light) 20%,
    rgba(255, 255, 255, 0.8) 30%,
    var(--color-primary-light) 70%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
  background-size: 200% auto;
  animation: textShine 3s linear infinite;
}

@keyframes textShine {
  to {
    background-position: 200% center;
  }
}

/* Custom utilities */
.bg-gradient-radial {
  background-image: radial-gradient(var(--tw-gradient-stops));
}

.shadow-glow {
  box-shadow: 0 0 8px var(--color-primary-light);
}

/* Animations */
@keyframes loading-progress {
  0% {
    transform: scaleX(0);
  }
  50% {
    transform: scaleX(0.7);
  }
  100% {
    transform: scaleX(0.9);
  }
}

.animate-loading-progress {
  animation: loading-progress 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Transitions */
.content-fade-enter-active,
.content-fade-leave-active {
  transition: opacity 0.8s ease;
}

.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
