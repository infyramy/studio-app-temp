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
        v-else
        class="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300"
        ref="receiptContent"
      >
        <!-- Status Badge -->
        <div
          class="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
        >
          Manual Payment Required
        </div>

        <!-- Decorative Elements -->
        <div class="absolute top-0 left-0 w-full h-1.5 bg-yellow-500"></div>
        <div
          class="absolute top-1.5 left-0 w-full h-0.5 bg-yellow-500/20"
        ></div>

        <!-- Receipt Content -->
        <div class="p-5 sm:p-8">
          <!-- Header with Status Icon -->
          <div class="text-center mb-8">
            <div class="mb-6 relative">
              <div
                class="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-yellow-100"
              >
                <svg
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
              </div>
              <div
                class="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
              >
                <div
                  class="px-3 py-0.5 rounded-full bg-yellow-100 text-yellow-800"
                >
                  <span class="text-xs font-medium">Payment Pending</span>
                </div>
              </div>
            </div>
            <h1
              class="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] font-playfair mb-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] bg-clip-text text-transparent"
            >
              Booking Reference
            </h1>
            <div class="space-y-0.5">
              <p class="text-[var(--color-text-primary)]/70 text-base">
                Receipt #{{ bookingDetails.payment_ref_number || "N/A" }}
              </p>
              <p class="text-[var(--color-text-primary)]/70 text-sm">
                {{ formatDatetime(bookingDetails.created_date) }}
              </p>
            </div>
          </div>

          <!-- Manual Payment Notice -->
          <div
            class="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <svg
                  class="w-5 h-5 text-yellow-500"
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
              </div>
              <div>
                <h3 class="text-sm font-medium text-yellow-800">
                  Manual Payment Required
                </h3>
                <p class="mt-1 text-sm text-yellow-700">
                  Our admin will contact you via WhatsApp within 24 hours with
                  payment instructions. Your booking will be confirmed once
                  payment is received.
                </p>
              </div>
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
                  {{ bookingDetails.user_fullname }}
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
                  {{ bookingDetails.user_email }}
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
                  {{ bookingDetails.user_phoneno }}
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
                  {{ formatDate(bookingDetails.session_date) }}
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
                  {{ formatTime(bookingDetails.session_time) }}
                </p>
                <p class="text-[var(--color-text-primary)]/70 text-sm">
                  {{ bookingDetails.title }}
                </p>
              </div>
            </div>
          </div>

          <!-- Referral Information -->
          <div
            v-if="bookingDetails.referral_code"
            class="bg-[var(--color-bg-light)]/50 backdrop-blur p-4 rounded-xl mb-6"
          >
            <h3
              class="text-sm font-medium text-[var(--color-text-primary)] mb-4 font-playfair"
            >
              Referral Information
            </h3>
            <div class="space-y-2">
              <p class="text-base font-medium text-[var(--color-text-primary)]">
                {{ bookingDetails.referral_code }}
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
                  <span
                    v-if="bookingDetails.number_of_pax"
                    class="ml-1 text-xs"
                  >
                    ({{ bookingDetails.number_of_pax }} pax)
                  </span>
                </span>
                <span class="font-medium text-[var(--color-text-primary)]">
                  RM {{ formatPrice(bookingDetails.theme_price) }}
                </span>
              </div>

              <!-- Peak Period Adjustment -->
              <div
                v-if="bookingDetails.theme_surcharge_amount"
                class="flex justify-between text-sm"
              >
                <span class="text-[var(--color-text-muted)] flex items-center">
                  Peak Period Adjustment
                </span>
                <span class="font-medium text-[var(--color-text-primary)]">
                  RM {{ formatPrice(bookingDetails.theme_surcharge_amount) }}
                </span>
              </div>

              <!-- Add-ons -->
              <template v-if="bookingDetails.addons?.length">
                <div class="flex justify-between text-sm">
                  <span
                    class="text-[var(--color-text-muted)] flex items-center"
                  >
                    Add-ons Total
                  </span>
                  <span class="font-medium text-[var(--color-text-primary)]">
                    RM {{ formatPrice(bookingDetails.payment_addon_total) }}
                  </span>
                </div>
                <div
                  v-for="addon in bookingDetails.addons"
                  :key="addon.id"
                  class="flex justify-between text-xs text-[var(--color-text-muted)] pl-6"
                >
                  <span>{{ addon.name }} (x{{ addon.quantity }})</span>
                  <span
                    >RM {{ formatPrice(addon.price * addon.quantity) }}</span
                  >
                </div>
              </template>

              <!-- Extra Pax Charge -->
              <div
                v-if="bookingDetails.payment_extra_pax"
                class="flex justify-between text-sm"
              >
                <span class="text-[var(--color-text-muted)] flex items-center">
                  Extra Person Charge
                </span>
                <span class="font-medium text-[var(--color-text-primary)]">
                  RM {{ formatPrice(bookingDetails.payment_extra_pax) }}
                </span>
              </div>

              <!-- Total and Deposit -->
              <div class="pt-3 border-t border-[var(--color-border-primary)]">
                <div class="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span
                    >RM
                    {{ formatPrice(bookingDetails.payment_total || 0) }}</span
                  >
                </div>

                <div v-if="bookingDetails.payment_type == 2">
                  <div class="flex justify-between text-sm mt-1">
                    <span class="text-[var(--color-text-muted)]"
                      >Required Deposit</span
                    >
                    <span
                      >RM
                      {{ formatPrice(bookingDetails.payment_deposit) }}</span
                    >
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-[var(--color-text-muted)]"
                      >Balance Due</span
                    >
                    <span
                      >RM
                      {{
                        formatPrice(
                          bookingDetails.payment_total -
                            bookingDetails.payment_amount
                        )
                      }}</span
                    >
                  </div>
                </div>

                <div v-else>
                  <div class="flex justify-between text-sm mt-1">
                    <span class="text-[var(--color-text-muted)]"
                      >Amount must be paid</span
                    >
                    <span
                      >RM
                      {{ formatPrice(bookingDetails.payment_total || 0) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Amount to Pay - Prominent Display -->
          <div class="text-center mb-6">
            <h3
              class="text-sm font-medium text-[var(--color-text-primary)] mb-2 font-playfair"
            >
              Payment Options
            </h3>
            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
            >
              <!-- Deposit Option -->
              <div
                class="bg-white/50 backdrop-blur rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[var(--color-primary)]/20"
              >
                <div class="text-sm text-[var(--color-text-muted)] mb-1">
                  Deposit Amount
                </div>
                <div
                  class="text-2xl font-bold text-[var(--color-primary)] mb-2"
                >
                  RM {{ formatPrice(bookingDetails.payment_deposit || 0) }}
                </div>
                <div class="text-xs text-[var(--color-text-muted)]">
                  Balance due: RM
                  {{
                    formatPrice(
                      (bookingDetails.payment_total || 0) -
                        (bookingDetails.payment_deposit || 0)
                    )
                  }}
                </div>
              </div>

              <!-- Full Payment Option -->
              <div
                class="bg-white/50 backdrop-blur rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[var(--color-primary)]/20"
              >
                <div class="text-sm text-[var(--color-text-muted)] mb-1">
                  Full Payment
                </div>
                <div
                  class="text-2xl font-bold text-[var(--color-primary)] mb-2"
                >
                  RM {{ formatPrice(bookingDetails.payment_total || 0) }}
                </div>
                <div class="text-xs text-[var(--color-text-muted)]">
                  Pay in full and secure your booking
                </div>
              </div>
            </div>

            <!-- Payment Option Notice -->
            <div
              class="mt-4 text-sm text-[var(--color-text-muted)] bg-white/30 backdrop-blur rounded-lg p-3 flex items-start space-x-2"
            >
              <svg
                class="w-5 h-5 text-[var(--color-primary)] flex-shrink-0"
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
              <span>
                You can choose to pay either the deposit amount or the full
                payment. The balance payment can be made later if you choose to
                pay the deposit now.
              </span>
            </div>
          </div>

          <!-- Payment Methods Tabs -->
          <div class="mb-6">
            <div
              class="flex justify-center space-x-1 bg-white/30 backdrop-blur p-1 rounded-lg"
            >
              <button
                @click="activePaymentMethod = 'qr'"
                :class="[
                  'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  activePaymentMethod === 'qr'
                    ? 'bg-white shadow text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
                ]"
              >
                <span class="flex items-center justify-center space-x-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <span>QR Code</span>
                </span>
              </button>
              <button
                @click="activePaymentMethod = 'bank'"
                :class="[
                  'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  activePaymentMethod === 'bank'
                    ? 'bg-white shadow text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
                ]"
              >
                <span class="flex items-center justify-center space-x-2">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span>Bank Transfer</span>
                </span>
              </button>
            </div>
          </div>

          <!-- Payment Content -->
          <div class="bg-white/50 backdrop-blur rounded-xl p-6">
            <!-- QR Code Payment -->
            <div
              v-if="activePaymentMethod === 'qr'"
              class="flex flex-col items-center space-y-6"
            >
              <div class="relative bg-white p-6 rounded-xl shadow-sm">
                <img
                  :src="config.bankQrCode"
                  alt="Payment QR Code"
                  class="w-56 h-56 object-contain"
                  ref="qrCodeImage"
                />
              </div>

              <button
                @click="downloadQRCode"
                class="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/80 transition-colors flex items-center space-x-2 shadow-sm"
              >
                <svg
                  class="w-4 h-4"
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
                <span>Download QR Code</span>
              </button>

              <p class="text-sm text-[var(--color-text-muted)] text-center">
                Scan this QR code with your banking app to make the payment
              </p>
            </div>

            <!-- Bank Transfer -->
            <div v-else class="space-y-6">
              <div class="grid grid-cols-1 gap-4 text-sm">
                <div
                  class="flex justify-between items-center py-2 border-b border-[var(--color-border-primary)]/30"
                >
                  <span class="text-[var(--color-text-muted)]">Bank Name</span>
                  <span class="font-medium text-[var(--color-text-primary)]">{{
                    config.bankName
                  }}</span>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-[var(--color-border-primary)]/30"
                >
                  <span class="text-[var(--color-text-muted)]"
                    >Account Number</span
                  >
                  <div class="flex items-center space-x-3">
                    <span
                      class="font-medium text-[var(--color-text-primary)]"
                      >{{ config.bankAccountNo }}</span
                    >
                    <button
                      @click="copyToClipboard(config.bankAccountNo)"
                      class="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 p-1 hover:bg-[var(--color-primary)]/10 rounded-full transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  class="flex justify-between items-center py-2 border-b border-[var(--color-border-primary)]/30"
                >
                  <span class="text-[var(--color-text-muted)]"
                    >Account Holder</span
                  >
                  <span class="font-medium text-[var(--color-text-primary)]">{{
                    config.bankAccountHolder
                  }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-[var(--color-text-muted)]">Reference</span>
                  <div class="flex items-center space-x-3">
                    <span
                      class="font-medium text-[var(--color-text-primary)]"
                      >{{ route.query.booking || "N/A" }}</span
                    >
                    <button
                      @click="copyToClipboard(route.query.booking)"
                      class="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 p-1 hover:bg-[var(--color-primary)]/10 rounded-full transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Common Instructions -->
          <div class="mt-6 space-y-3 bg-white/30 backdrop-blur rounded-xl p-4">
            <p class="flex items-start space-x-3 text-sm">
              <svg
                class="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--color-primary)]"
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
              <span class="text-[var(--color-text-muted)]">
                Please include your booking reference
                <span class="font-medium text-[var(--color-text-primary)]">{{
                  route.query.booking || "N/A"
                }}</span>
                in the transfer description
              </span>
            </p>
            <p class="flex items-start space-x-3 text-sm">
              <svg
                class="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--color-primary)]"
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
              <span class="text-[var(--color-text-muted)]"
                >Your booking will be confirmed once we receive the
                payment</span
              >
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="border-t border-[var(--color-border-primary)] p-4 sm:p-6 bg-[var(--color-bg-light)]/50 backdrop-blur flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0"
        >
          <div
            class="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3"
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

            <button
              @click="fetchReceiptData"
              class="w-full sm:w-auto px-5 py-2 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 text-center"
              :disabled="isLoading"
            >
              <span class="flex items-center justify-center">
                <svg
                  class="w-4 h-4 mr-2"
                  :class="{ 'animate-spin': isLoading }"
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
                {{ isLoading ? "Refreshing..." : "Refresh Status" }}
              </span>
            </button>
          </div>

          <button
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
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "empty",
});

const route = useRoute();
const isLoading = ref(true);
const error = ref(null);
const bookingDetails = ref({});
const receiptContent = ref(null);
const qrCodeImage = ref(null);
const activePaymentMethod = ref("qr");

// Computed properties
const addonsTotal = computed(() => {
  if (!bookingDetails.value.add_ons?.length) return 0;
  return bookingDetails.value.add_ons.reduce((total, addon) => {
    return total + addon.price * addon.quantity;
  }, 0);
});

const totalAmount = computed(() => {
  const base = bookingDetails.value.base_price || 0;
  const peak = bookingDetails.value.peak_adjustment || 0;
  const addons = addonsTotal.value;
  const extraPax = bookingDetails.value.extra_pax_charge || 0;
  return base + peak + addons + extraPax;
});

const balanceDue = computed(() => {
  return totalAmount.value - (bookingDetails.value.deposit_amount || 0);
});

// Helper functions
function formatPrice(amount) {
  if (amount === undefined || amount === null) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "N/A";
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

function formatDatetime(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

async function downloadReceipt() {
  try {
    const element = receiptContent.value;
    if (!element) {
      console.error("Receipt content element not found");
      return;
    }

    // Dynamically import html2pdf only when needed
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 1,
      filename: `booking-receipt-${route.query.booking || "unknown"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

async function downloadQRCode() {
  try {
    const imageUrl = config.value.bankQrCode;

    // Fetch the image as a blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a blob URL
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `payment-qr-${route.query.booking || "unknown"}.png`;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading QR code:", error);
  }
}

// Add this new function for copying to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
    console.log("Copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

// Fetch booking details
async function fetchReceiptData() {
  try {
    isLoading.value = true;
    error.value = null;

    if (!route.query.booking) {
      throw new Error("No booking reference provided");
    }

    const response = await fetch(
      `/api/booking/receipt-detail?receiptNumber=${route.query.booking}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch receipt details");
    }

    const data = await response.json();

    if (data.status !== "success" || !data.data) {
      throw new Error(data.message || "Failed to load receipt data");
    }

    bookingDetails.value = data.data;
  } catch (err) {
    console.error("Error fetching receipt:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

const config = ref({});

async function getConfig() {
  const response = await $fetch("/api/setting/get-organization");
  config.value = response.data;
}

// Initialize on mount
onMounted(() => {
  fetchReceiptData();
  getConfig();
});
</script>

<style>
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
