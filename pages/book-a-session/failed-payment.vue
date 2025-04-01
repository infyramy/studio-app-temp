<template>
  <div
    class="min-h-screen font-sans flex items-center justify-center bg-gradient-radial from-[var(--color-bg-primary)] via-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] py-6"
  >
    <div class="w-full max-w-2xl mx-auto px-4">
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center"
      >
        <div class="flex flex-col items-center justify-center space-y-6">
          <!-- Loading Text -->
          <div class="space-y-3">
            <h2 class="text-xl font-bold text-[var(--color-text-primary)]">
              Loading Payment Status
            </h2>
            <p class="text-[var(--color-text-primary)]/70 text-sm">
              Please wait while we check your payment status...
            </p>
          </div>

          <!-- Loading Progress -->
          <div class="w-full max-w-xs space-y-2">
            <div
              class="h-1.5 bg-[var(--color-primary)]/10 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-[var(--color-primary)] rounded-full w-1/3 animate-[loading_2s_ease-in-out_infinite]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        <div>
          <div class="flex justify-center items-center">
            <div
              class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2
            class="text-lg font-bold text-[var(--color-text-primary)] mt-6 mb-2"
          >
            Error Loading Payment Status
          </h2>
          <p class="text-[var(--color-text-primary)]/70 mb-4">{{ error }}</p>

          <div class="flex justify-center items-center space-x-4">
            <button
              @click="retryLoading"
              class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/80 transition-colors"
            >
              Try Again
            </button>
            <button
              @click="handleGoHome"
              class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/80 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div
        v-else
        class="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300"
      >
        <!-- Red Status Bar -->
        <div class="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
        <div class="absolute top-1.5 left-0 w-full h-0.5 bg-red-500/20"></div>

        <div class="p-5 sm:p-8">
          <!-- Status Icon -->
          <div class="text-center mb-8">
            <div class="mb-6 relative">
              <div
                class="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center"
              >
                <svg
                  class="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div
                class="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
              >
                <div class="px-3 py-0.5 rounded-full bg-red-100 text-red-800">
                  <span class="text-xs font-medium">
                    {{
                      status === "failed"
                        ? "Payment Failed"
                        : "Payment Cancelled"
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Title -->
            <h1
              class="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] font-playfair mb-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] bg-clip-text"
            >
              {{ status === "failed" ? "Payment Failed" : "Payment Cancelled" }}
            </h1>

            <!-- Message -->
            <p class="text-[var(--color-text-primary)]/70 text-base mb-8">
              {{
                status === "failed"
                  ? "We were unable to process your payment. Please try again or contact support if the issue persists."
                  : "Your payment has been cancelled. You can try booking again when you are ready."
              }}
            </p>

            <!-- Booking Reference Card -->
            <div
              class="bg-[var(--color-bg-light)]/50 backdrop-blur p-4 rounded-xl mb-6"
            >
              <h3
                class="text-sm font-medium text-[var(--color-text-primary)] mb-3 font-playfair flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 mr-2 text-[var(--color-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Booking Reference
              </h3>
              <p
                class="text-lg font-medium text-[var(--color-text-primary)] text-center"
              >
                {{ bookingRef }}
              </p>

              <div class="mt-4">
                <h3
                  class="text-sm font-medium text-[var(--color-text-primary)] mb-3 font-playfair flex items-center justify-center"
                >
                  Amount
                </h3>
                <p
                  class="text-lg font-medium text-[var(--color-text-primary)] text-center"
                >
                  {{
                    receiptDetail
                      ? formatPrice(Number(receiptDetail.payment_amount))
                      : "-"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="border-t border-[var(--color-border-primary)] p-4 sm:p-6 bg-[var(--color-bg-light)]/50 backdrop-blur flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
        >
          <button
            @click="handleGoHome"
            class="w-full sm:w-auto px-5 py-2 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 text-center"
          >
            <span class="flex items-center justify-center">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAsyncState } from "@vueuse/core";

definePageMeta({
  layout: "empty",
});

const router = useRouter();
const route = useRoute();
const error = ref<string | null>(null);

// Get URL parameters
const bookingRef = computed(() => (route.query.booking as string) || "N/A");
const status = computed(() => (route.query.status as string) || "failed");

interface ReceiptDetail {
  payment_amount: number;
  referral?: string;
  // Add other fields as needed
}

// Async state management
const { state: receiptDetail, isLoading } = useAsyncState<ReceiptDetail | null>(
  async () => {
    try {
      error.value = null;
      const [receiptResponse] = await Promise.all([
        $fetch<ReceiptDetail>(
          `/api/booking/receipt-detail?receiptNumber=${route.query.booking}`
        ),
        $fetch(
          `/api/booking/update-payment-failed?receiptNumber=${route.query.booking}&status=${route.query.status}`,
          {
            method: "GET",
          }
        ),
      ]);
      console.log("Receipt Response:", receiptResponse); // Temporary log to debug
      if (!receiptResponse) {
        throw new Error("No receipt data received");
      }
      return {
        payment_amount: Number(receiptResponse.data.payment_amount) || 0,
        referral: receiptResponse.data.referral,
      };
    } catch (err) {
      console.error("Error in receipt fetch:", err); // Temporary log to debug
      error.value =
        err instanceof Error ? err.message : "Failed to load payment status";
      return null;
    }
  },
  null
);

// Navigation handlers
function bookAgain() {
  if (receiptDetail.value?.referral) {
    router.push(`/book-a-session?ref=${receiptDetail.value.referral}`);
  } else {
    router.push("/book-a-session");
  }
}

function handleGoHome() {
  if (receiptDetail.value?.referral) {
    router.push(`/?ref=${receiptDetail.value.referral}`);
  } else {
    router.push("/");
  }
}

function retryLoading() {
  error.value = null;
  receiptDetail.value = null;
  // This will trigger a re-fetch
  window.location.reload();
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(price);
}
</script>

<style>
/* Component specific styles */
.bg-gradient-radial {
  background: radial-gradient(
    circle at center,
    var(--tw-gradient-from) 0%,
    var(--tw-gradient-via) 50%,
    var(--tw-gradient-to) 100%
  );
}
</style>
