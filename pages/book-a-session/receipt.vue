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
              Loading Receipt
            </h2>
            <p class="text-[var(--color-text-primary)]/70 text-sm">
              Please wait while we prepare your receipt...
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
        v-else-if="error && !receiptData"
        class="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center transform hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        <div class="">
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
            Error Loading Receipt
          </h2>
          <p class="text-[var(--color-text-primary)]/70 mb-4">{{ error }}</p>
          <button
            @click="fetchReceiptData"
            class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/80 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>

      <!-- Receipt Card -->
      <div
        v-else-if="receiptData"
        class="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300"
      >
        <!-- Status Badge -->
        <div
          v-if="statusDisplay"
          class="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium"
          :class="{
            'bg-yellow-100 text-yellow-800': statusDisplay.type === 'pending',
            'bg-green-100 text-green-800': statusDisplay.type === 'success',
            'bg-red-100 text-red-800': statusDisplay.type === 'failed',
          }"
        >
          {{ statusDisplay.label }}
          <button
            v-if="statusDisplay.type === 'pending'"
            @click="recheckBookingStatus"
            class="ml-2 text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
            :disabled="isRecheckingStatus"
          >
            <svg
              class="w-4 h-4"
              :class="{ 'animate-spin': isRecheckingStatus }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <!-- Decorative Elements -->
        <div
          class="absolute top-0 left-0 w-full h-1.5"
          :class="{
            'bg-yellow-500': statusDisplay?.type === 'pending',
            'bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary-dark)]':
              statusDisplay?.type === 'success',
            'bg-red-500': statusDisplay?.type === 'failed',
          }"
        ></div>
        <div
          class="absolute top-1.5 left-0 w-full h-0.5"
          :class="{
            'bg-yellow-500/20': statusDisplay?.type === 'pending',
            'bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary-light)]/20 to-[var(--color-primary-dark)]/20':
              statusDisplay?.type === 'success',
            'bg-red-500/20': statusDisplay?.type === 'failed',
          }"
        ></div>

        <!-- Receipt Content -->
        <div class="p-5 sm:p-8" ref="receiptContent">
          <!-- Header with Status Icon -->
          <div class="text-center mb-8">
            <div class="mb-6 relative">
              <div
                class="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                :class="{
                  'bg-yellow-100': statusDisplay?.type === 'pending',
                  'bg-[var(--color-primary)]/10':
                    statusDisplay?.type === 'success',
                  'bg-red-100': statusDisplay?.type === 'failed',
                }"
              >
                <!-- Pending Icon -->
                <svg
                  v-if="statusDisplay?.type === 'pending'"
                  class="w-10 h-10 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <!-- Success Icon -->
                <svg
                  v-else-if="statusDisplay?.type === 'success'"
                  class="w-10 h-10 text-[var(--color-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    class="animate-[dash_1.5s_ease-in-out_forwards]"
                    style="stroke-dasharray: 100; stroke-dashoffset: 100"
                  />
                </svg>
                <!-- Failed Icon -->
                <svg
                  v-else-if="statusDisplay?.type === 'failed'"
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
                <div
                  class="px-3 py-0.5 rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800':
                      statusDisplay?.type === 'pending',
                    'bg-[var(--color-primary)]/10 text-[var(--color-primary)]':
                      statusDisplay?.type === 'success',
                    'bg-red-100 text-red-800': statusDisplay?.type === 'failed',
                  }"
                >
                  <span class="text-xs font-medium">
                    {{
                      statusDisplay?.type === "pending"
                        ? "Payment Pending"
                        : statusDisplay?.type === "success"
                        ? "Payment Successful"
                        : "Payment Failed"
                    }}
                  </span>
                </div>
              </div>
            </div>
            <h1
              class="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] font-playfair mb-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] bg-clip-text"
            >
              Booking Confirmation
            </h1>
            <div class="space-y-0.5">
              <p class="text-[var(--color-text-primary)]/70 text-base">
                Receipt #{{ receiptData?.payment_ref_number || "N/A" }}
              </p>
              <p class="text-[var(--color-text-primary)]/70 text-sm">
                {{ formatDatetime(receiptData?.created_date) }}
              </p>
            </div>
          </div>

          <!-- Customer & Session Details in Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div
              class="bg-[var(--color-bg-light)]/50 backdrop-blur p-4 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <h3
                class="text-sm font-medium text-[var(--color-text-primary)] mb-3 font-playfair flex items-center"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Customer Details
              </h3>
              <div class="space-y-2">
                <p
                  class="text-base font-medium text-[var(--color-text-primary)] capitalize"
                >
                  {{ receiptData?.user_fullname || "N/A" }}
                </p>
                <div
                  class="flex items-center text-[var(--color-text-primary)]/70 text-sm"
                >
                  <svg
                    class="w-3.5 h-3.5 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {{ receiptData?.user_email || "N/A" }}
                </div>
                <div
                  class="flex items-center text-[var(--color-text-primary)]/70 text-sm"
                >
                  <svg
                    class="w-3.5 h-3.5 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {{ receiptData?.user_phoneno || "N/A" }}
                </div>
              </div>
            </div>

            <div
              class="bg-[var(--color-bg-light)]/50 backdrop-blur p-4 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <h3
                class="text-sm font-medium text-[var(--color-text-primary)] mb-3 font-playfair flex items-center"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Session Details
              </h3>
              <div class="space-y-2">
                <p
                  class="text-base font-medium text-[var(--color-text-primary)]"
                >
                  {{ formatDate(receiptData?.session_date) }}
                </p>
                <p
                  class="text-[var(--color-text-primary)]/70 flex items-center text-sm"
                >
                  <svg
                    class="w-3.5 h-3.5 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ formatTime(receiptData?.session_time) || "N/A" }}
                </p>
                <p class="text-[var(--color-text-primary)]/70 text-sm">
                  {{ receiptData?.title }}
                </p>
              </div>
            </div>
          </div>

          <!-- Referral Information -->
          <div
            v-if="receiptData.referral_code"
            class="bg-[var(--color-bg-light)]/50 backdrop-blur p-4 rounded-xl mb-6"
          >
            <h3
              class="text-sm font-medium text-[var(--color-text-primary)] mb-4 font-playfair"
            >
              Referral Information
            </h3>
            <div class="space-y-2">
              <p class="text-base font-medium text-[var(--color-text-primary)]">
                {{ receiptData.referral_code }}
              </p>
            </div>
          </div>

          <!-- Payment Summary -->
          <div
            class="bg-[var(--color-bg-light)]/50 backdrop-blur p-4 rounded-xl mb-6"
          >
            <h3
              class="text-sm font-medium text-[var(--color-text-primary)] mb-4 font-playfair"
            >
              Payment Summary
            </h3>
            <div class="space-y-3">
              <!-- Base Price -->
              <div class="flex justify-between text-sm">
                <span class="text-[var(--color-text-muted)] flex items-center">
                  <svg
                    class="w-4 h-4 mr-1.5 text-[var(--color-text-muted)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Base Price
                  <span v-if="receiptData?.number_of_pax" class="ml-1 text-xs">
                    ({{ receiptData.number_of_pax }} pax)
                  </span>
                </span>
                <span class="font-medium text-[var(--color-text-primary)]">
                  RM {{ formatPrice(receiptData?.theme_price || 0) }}
                </span>
              </div>

              <!-- Peak Period Adjustment -->
              <div
                v-if="receiptData?.theme_surcharge_amount"
                class="flex justify-between text-sm"
              >
                <span class="text-[var(--color-text-muted)] flex items-center">
                  <svg
                    class="w-4 h-4 mr-1.5"
                    :class="[
                      receiptData.theme_surcharge_amount > 0
                        ? 'text-amber-500'
                        : 'text-green-500',
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{
                    receiptData.theme_surcharge_amount > 0
                      ? "Peak Period Surcharge"
                      : "Special Period Discount"
                  }}
                  <span
                    v-if="receiptData.theme_surcharge_type === 2"
                    class="ml-1 text-xs"
                  >
                    ({{ receiptData.theme_surcharge_amount }}%)
                  </span>
                </span>
                <span
                  :class="[
                    receiptData.theme_surcharge_amount > 0
                      ? 'text-amber-600'
                      : 'text-green-600',
                  ]"
                >
                  RM {{ formatPrice(receiptData.theme_surcharge_amount) }}
                </span>
              </div>

              <!-- Add-ons -->
              <template v-if="receiptData?.payment_addon_total">
                <div class="flex justify-between text-sm">
                  <span
                    class="text-[var(--color-text-muted)] flex items-center"
                  >
                    <svg
                      class="w-4 h-4 mr-1.5 text-[var(--color-text-muted)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Add-ons Total
                  </span>
                  <span class="font-medium text-[var(--color-text-primary)]">
                    RM {{ formatPrice(receiptData.payment_addon_total) }}
                  </span>
                </div>
                <!-- Individual Add-ons -->
                <template v-if="receiptData.addons">
                  <div
                    v-for="addon in receiptData.addons"
                    :key="addon.id"
                    class="flex justify-between text-xs text-[var(--color-text-muted)] pl-6"
                  >
                    <span>{{ addon.name }} (x{{ addon.quantity }})</span>
                    <span
                      >RM {{ formatPrice(addon.price * addon.quantity) }}</span
                    >
                  </div>
                </template>
              </template>

              <!-- Extra Pax Charge -->
              <div
                v-if="receiptData?.payment_extra_pax"
                class="flex justify-between text-sm"
              >
                <span class="text-[var(--color-text-muted)] flex items-center">
                  <svg
                    class="w-4 h-4 mr-1.5 text-[var(--color-text-muted)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Extra Pax Charge
                  <span class="ml-1 text-xs">
                    ({{ receiptData.number_of_extra_pax }} × RM
                    {{
                      formatPrice(
                        receiptData.payment_extra_pax /
                          receiptData.number_of_extra_pax
                      )
                    }})
                  </span>
                </span>
                <span class="font-medium text-[var(--color-text-primary)]">
                  RM {{ formatPrice(receiptData.payment_extra_pax) }}
                </span>
              </div>

              <!-- Total Amount -->
              <div
                class="flex justify-between text-sm font-bold pt-3 border-t border-[var(--color-border-primary)]"
              >
                <span class="text-[var(--color-text-primary)]"
                  >Total Amount</span
                >
                <span class="text-[var(--color-text-primary)]">
                  RM {{ formatPrice(receiptData?.payment_total || 0) }}
                </span>
              </div>

              <!-- Payment Details -->
              <div
                v-if="receiptData?.payment_type == 2"
                class="bg-[var(--color-primary)]/5 p-3 rounded-lg mt-3"
              >
                <div class="flex justify-between items-center mb-1.5">
                  <span class="text-[var(--color-text-primary)] text-sm"
                    >Deposit Paid</span
                  >
                  <span
                    class="text-base font-medium text-[var(--color-primary)]"
                  >
                    RM {{ formatPrice(receiptData?.payment_amount || 0) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[var(--color-text-primary)] text-sm"
                    >Balance Due</span
                  >
                  <span
                    class="text-base font-medium text-[var(--color-text-primary)]"
                  >
                    RM
                    {{
                      formatPrice(
                        receiptData?.payment_total -
                          receiptData?.payment_amount || 0
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div
            class="space-y-3 text-xs text-[var(--color-text-primary)]/70 bg-[var(--color-bg-light)]/30 p-4 rounded-xl"
          >
            <div
              v-if="receiptData?.payment_type == 2"
              class="flex justify-center items-start space-x-2"
            >
              <svg
                class="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Balance payment is due on the day of the session.</p>
            </div>
            <div class="flex justify-center items-start space-x-2">
              <svg
                class="w-4 h-4 text-[var(--color-primary)] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-center">
                Please keep this receipt for your records.
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="border-t border-[var(--color-border-primary)] p-4 sm:p-6 bg-[var(--color-bg-light)]/50 backdrop-blur flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
        >
          <NuxtLink
            to="/"
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
          </NuxtLink>

          <div class="flex space-x-3">
            <!-- Refresh Status Button - Only show for pending status -->
            <button
              v-if="receiptData?.status === 1"
              @click="recheckBookingStatus"
              class="w-full sm:w-auto px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-medium hover:from-yellow-600 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              :disabled="isRecheckingStatus"
            >
              <span class="flex items-center justify-center">
                <svg
                  class="w-4 h-4 mr-2"
                  :class="{ 'animate-spin': isRecheckingStatus }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {{ isRecheckingStatus ? "Refreshing..." : "Refresh Status" }}
              </span>
            </button>

            <!-- Download Button - Only show for success status (2 or 3) -->
            <button
              v-if="[2, 3].includes(receiptData?.status || 0)"
              @click="downloadReceipt"
              class="w-full sm:w-auto px-5 py-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-sm font-medium hover:from-[var(--color-primary-dark)] hover:to-[var(--color-primary)] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download PDF
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Html2PdfWorker } from "html2pdf.js";

definePageMeta({
  layout: "empty",
});

interface ReceiptData {
  payment_ref_number: string;
  created_date: string;
  user_fullname: string;
  user_email: string;
  user_phoneno: string;
  session_date: string;
  session_time: string;
  title: string;
  price: number;
  payment_extra_pax: number;
  number_of_extra_pax: number;
  payment_addon_total: number;
  payment_amount: number;
  payment_total: number;
  payment_type: number;
  customer_email: string;
  customer_name: string;
  phone: string;
  status: number;
  theme_price: number;
  theme_surcharge_amount: number;
  theme_surcharge_type: number;
  number_of_pax: number;
  addon: string;
}

const route = useRoute();
const router = useRouter();

const bookingId = route.query.booking_id as string;
const paymentStatus = (route.query.status as string) || null;

const isLoading = ref(true);
const error = ref<string | null>(null);
const receiptData = ref<ReceiptData | null>(null);
const isProcessingPayment = ref(false);
const paymentUrl = ref<string | null>(null);
const isRecheckingStatus = ref(false);

// Add status mapping
const STATUS_MAP = {
  1: { label: "Pending", type: "pending" },
  2: { label: "Partially Paid", type: "success" },
  3: { label: "Paid", type: "success" },
  4: { label: "Failed", type: "failed" },
} as const;

// Add computed for status display
const statusDisplay = computed(() => {
  if (!receiptData.value?.status) return null;
  return STATUS_MAP[receiptData.value.status as keyof typeof STATUS_MAP];
});

// Add recheck status function
async function recheckBookingStatus() {
  if (!receiptData.value) return;

  try {
    isRecheckingStatus.value = true;
    error.value = null;

    const response = await fetch(
      `/api/booking/receipt-detail?receiptNumber=${route.query.booking}`
    );

    if (!response.ok) throw new Error("Failed to recheck booking status");

    const { data, status, message } = await response.json();

    if (status !== "success" || !data) {
      throw new Error(message || "Failed to recheck booking status");
    }

    // Update receipt data with new status
    receiptData.value = data;
  } catch (err: any) {
    console.error("Error rechecking status:", err);
    error.value = err.message;
  } finally {
    isRecheckingStatus.value = false;
  }
}

// Add these new refs and constants
const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_POLLING_ATTEMPTS = 60; // 5 minutes total
const purchaseId = ref<string | null>(null);
const pollingCount = ref(0);
const pollingTimer = ref<NodeJS.Timeout | null>(null);

// Format functions
function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return "0.00";
  return amount.toFixed(2);
}

function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDatetime(dateString: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

function formatTime(timeString: string): string {
  if (!timeString) return "N/A";
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

// Fetch receipt data
async function fetchReceiptData() {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await fetch(
      `/api/booking/receipt-detail?receiptNumber=${route.query.booking}`
    );
    if (!response.ok) throw new Error("Failed to load receipt data");
    const { data, status, message } = await response.json();

    if (status !== "success" || !data) {
      throw new Error(message || "Failed to load receipt data");
    }

    console.log("Receipt Data:", data); // Debug log
    receiptData.value = data;
  } catch (err: any) {
    console.error("Error fetching receipt:", err);
    error.value = err.message;
    receiptData.value = null;
  } finally {
    isLoading.value = false;
  }
}

// Add payment status polling function
async function checkPaymentStatus() {
  if (!purchaseId.value || pollingCount.value >= MAX_POLLING_ATTEMPTS) {
    stopPolling();
    return;
  }

  try {
    const response = await fetch(
      `/api/booking/check-payment-status?purchase_id=${purchaseId.value}`
    );
    if (!response.ok) throw new Error("Failed to check payment status");

    const data = await response.json();
    pollingCount.value++;

    if (data.status === "completed") {
      // Payment successful
      stopPolling();
      await fetchReceiptData(); // Refresh receipt data
      window.location.href = `/book-a-session/receipt?booking=${route.query.booking}&status=success`;
    } else if (data.status === "failed" || data.status === "cancelled") {
      // Payment failed or cancelled
      stopPolling();
      error.value = `Payment ${data.status}. Please try again.`;
    }
  } catch (err: any) {
    console.error("Error checking payment status:", err);
    stopPolling();
  }
}

// Start polling
function startPolling(chipPurchaseId: string) {
  purchaseId.value = chipPurchaseId;
  pollingCount.value = 0;

  // Clear any existing polling
  stopPolling();

  // Start new polling
  pollingTimer.value = setInterval(checkPaymentStatus, POLLING_INTERVAL);
}

// Stop polling
function stopPolling() {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value);
    pollingTimer.value = null;
  }
}

// Update initialize payment function
async function initializePayment() {
  if (!receiptData.value) return;

  try {
    isProcessingPayment.value = true;
    const response = await fetch("/api/booking/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: receiptData.value.payment_amount,
        bookingId: bookingId,
        customerEmail: receiptData.value.customer_email,
        customerName: receiptData.value.customer_name,
        phone: receiptData.value.phone,
      }),
    });

    if (!response.ok) throw new Error("Failed to initialize payment");

    const data = await response.json();
    paymentUrl.value = data.checkout_url;

    // Start polling for payment status
    startPolling(data.id); // CHIP returns purchase ID in the response

    // Redirect to CHIP payment page
    window.location.href = data.checkout_url;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    isProcessingPayment.value = false;
  }
}

// Watch for payment status changes
watch(
  () => route.query.status,
  (newStatus) => {
    if (newStatus === "failed") {
      error.value = "Payment failed. Please try again.";
    } else if (newStatus === "cancelled") {
      error.value = "Payment was cancelled. Please try again.";
    }
  }
);

// Add ref for html2pdf instance
const html2pdf = ref<(() => Html2PdfWorker) | null>(null);
const receiptContent = ref<HTMLElement | null>(null);

// Add this new function after fetchReceiptData
async function updateBookingStatus(status: string) {
  try {
    const response = await fetch(
      `/api/booking/update-status?receiptNumber=${route.query.booking}&status=${status}`
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update booking status");
    }
    return await response.json();
  } catch (err: any) {
    console.error("Error updating booking status:", err);
    throw err;
  }
}

// Add loading delay function
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Update the onMounted hook
onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Add initial delay to allow callback to complete
    await delay(2000);

    // Load html2pdf
    html2pdf.value = (await import("html2pdf.js")).default;

    // If no booking data is available, show error
    if (!route.query.booking) {
      error.value = "No booking reference found";
      return;
    }

    // Fetch receipt data
    await fetchReceiptData();

    // Handle status based on API response
    if (receiptData.value) {
      switch (receiptData.value.status) {
        case 1: // Pending
        case 2: // Partial payment (success)
        case 3: // Full payment (success)
        case 4: // Failed - still show receipt with failed status
          break;
        default:
          error.value = "Invalid payment status";
          receiptData.value = null; // Clear receipt data for invalid status
      }
    }
  } catch (err) {
    console.error("Error in component initialization:", err);
    error.value = "Failed to initialize receipt generation";
  } finally {
    isLoading.value = false;
  }
});

// Get booking data from route query
const receiptNumber = computed(() => route.query.receipt || "");

// Session types configuration (same as in booking page)
const sessionTypes = [
  {
    value: "wedding",
    label: "Wedding Photography",
    price: 1500,
    deposit: 500,
  },
  {
    value: "event",
    label: "Event Photography",
    price: 800,
    deposit: 300,
  },
];

// Computed values with null checks
const sessionType = computed(() =>
  receiptData.value?.title
    ? sessionTypes.find((type) => type.label === receiptData.value?.title)
    : null
);

const sessionPrice = computed(() =>
  sessionType.value?.price ? formatPrice(sessionType.value.price) : "0.00"
);

const depositAmount = computed(() =>
  sessionType.value?.deposit ? formatPrice(sessionType.value.deposit) : "0.00"
);

const balanceAmount = computed(() => {
  if (!sessionType.value?.price || !sessionType.value?.deposit) return 0;
  return sessionType.value.price - sessionType.value.deposit;
});

const calculateTotal = computed(() => {
  if (!receiptData.value) return 0;
  const price = receiptData.value.price ?? 0;
  const extraPax = receiptData.value.payment_extra_pax ?? 0;
  const addonTotal = receiptData.value.payment_addon_total ?? 0;
  return price + extraPax + addonTotal;
});

const calculateBalanceDue = computed(() => {
  if (!receiptData.value) return 0;
  return (
    receiptData.value.payment_total - receiptData.value.payment_amount || 0
  );
});

const downloadReceipt = async () => {
  if (!html2pdf.value) {
    console.error("html2pdf not loaded");
    return;
  }

  const element = receiptContent.value;
  if (!element) return;

  const opt = {
    margin: 1,
    filename: `booking-receipt-${receiptNumber.value}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  try {
    await html2pdf.value().set(opt).from(element).save();
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    error.value = "Failed to generate PDF receipt";
  }
};

// Clean up on component unmount
onUnmounted(() => {
  stopPolling();
});

// Update the payment actions section
const showPaymentActions = computed(() => {
  if (!receiptData.value) return false;
  // Show payment actions only for pending or failed status
  return [1, 4].includes(receiptData.value.status);
});
</script>

<style>
/* Component specific styles */
@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes loading {
  0% {
    width: 0%;
    margin-left: 0;
  }
  50% {
    width: 100%;
    margin-left: 0;
  }
  100% {
    width: 0%;
    margin-left: 100%;
  }
}

.bg-gradient-radial {
  background: radial-gradient(
    circle at center,
    var(--tw-gradient-from) 0%,
    var(--tw-gradient-via) 50%,
    var(--tw-gradient-to) 100%
  );
}

@media print {
  .btn,
  button {
    display: none !important;
  }

  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
