<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"
    >
      <div>
        <h1
          class="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] font-playfair"
        >
          Photography Themes
        </h1>
        <p class="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          Manage your photography themes and packages
        </p>
      </div>
      <button
        @click="showAddThemeModal = true"
        class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 sm:h-5 sm:w-5 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add New Theme
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Themes Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6"
    >
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="bg-white rounded-lg shadow-sm border border-[var(--color-border-primary)] overflow-hidden hover:shadow-md transition-all duration-200"
      >
        <!-- Theme Image -->
        <div class="relative aspect-[16/9] bg-gray-100">
          <img
            :src="theme.image"
            :alt="theme.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Theme Content -->
        <div class="p-3 sm:p-4">
          <div
            class="flex flex-col sm:flex-row justify-between sm:items-start gap-1 sm:gap-0 mb-2"
          >
            <h3
              class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
            >
              {{ theme.title }}
            </h3>
            <div class="text-sm">
              <span
                v-if="theme.price_type == 1"
                class="font-medium text-[var(--color-primary)]"
              >
                {{
                  formatPrice(
                    theme.price ? parseFloat(String(theme.price)) : null
                  )
                }}
              </span>
              <span v-else class="text-[var(--color-text-muted)]">
                Variable Price (Pax-based)
              </span>
            </div>
          </div>
          <p
            class="text-xs sm:text-sm text-[var(--color-text-muted)] mb-2 line-clamp-2"
          >
            {{ theme.description }}
          </p>

          <!-- Active Date-Specific Prices -->
          <div
            v-if="
              theme.date_specific_prices &&
              theme.date_specific_prices.length > 0
            "
            class="mb-4"
          >
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(datePrice, index) in theme.date_specific_prices.filter(
                  (p) => p.is_active
                )"
                :key="index"
                class="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full text-xs"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="font-medium">
                  {{
                    datePrice.price_type == 2
                      ? `${
                          (datePrice.percentage || 0) > 0
                            ? "Surcharge"
                            : "Discount"
                        } ${Math.abs(datePrice.percentage || 0)}%`
                      : `${
                          (datePrice.amount || 0) > 0 ? "Additional" : "Reduced"
                        } ${formatPrice(Math.abs(datePrice.amount || 0))}`
                  }}
                </span>
                <span class="text-[var(--color-text-muted)]">
                  {{ formatDate(datePrice.start_date) }} -
                  {{ formatDate(datePrice.end_date) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Theme Status and Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <!-- Switch Toggle -->
              <button
                type="button"
                @click="toggleThemeStatus(theme)"
                class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="
                  theme.is_active ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
                "
                role="switch"
                :aria-checked="theme.is_active"
              >
                <span
                  class="pointer-events-none relative inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="theme.is_active ? 'translate-x-4' : 'translate-x-0'"
                />
              </button>
              <!-- Date Range Indicator -->
              <button
                @click="manageDateSpecificPrices(theme)"
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)] text-[var(--color-text-light)] hover:bg-[var(--color-primary-light)]/80 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                Date Range
              </button>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="editTheme(theme)"
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
                Edit
              </button>
              <button
                type="button"
                @click="confirmDelete(theme)"
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Theme Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="showAddThemeModal" as="template">
        <Dialog as="div" @close="closeAddThemeModal" class="relative z-[100]">
          <!-- Backdrop -->
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div
              class="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />
          </TransitionChild>

          <!-- Modal Container -->
          <div class="fixed inset-0 overflow-y-auto">
            <div
              class="flex min-h-full items-center justify-center p-4 text-center"
            >
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle
                    as="h3"
                    class="text-base sm:text-lg font-medium leading-6 text-[var(--color-text-primary)]"
                  >
                    {{ editingTheme ? "Edit Theme" : "Add New Theme" }}
                  </DialogTitle>

                  <form @submit.prevent="saveTheme" class="mt-4">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <!-- Left Column - Basic Information -->
                      <div class="space-y-4">
                        <h4
                          class="font-medium text-sm text-[var(--color-text-primary)]"
                        >
                          Basic Information
                        </h4>

                        <!-- Theme Title -->
                        <div>
                          <label
                            class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Title
                          </label>
                          <input
                            v-model="themeForm.title"
                            type="text"
                            required
                            class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                            placeholder="Enter theme title"
                          />
                        </div>

                        <!-- Theme Description -->
                        <div>
                          <label
                            class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Description
                          </label>
                          <textarea
                            v-model="themeForm.description"
                            rows="3"
                            required
                            class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                            placeholder="Enter theme description"
                          ></textarea>
                        </div>

                        <!-- Theme Image URL -->
                        <div>
                          <label
                            class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Image URL
                          </label>
                          <input
                            v-model="themeForm.image"
                            type="url"
                            class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                            placeholder="Enter image URL"
                          />
                        </div>

                        <!-- Theme Deposit -->
                        <div>
                          <label
                            class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Deposit Amount (MYR)
                          </label>
                          <div class="mt-1 relative rounded-md shadow-sm">
                            <div
                              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                              <span class="text-gray-500 sm:text-sm">RM</span>
                            </div>
                            <input
                              v-model.number="themeForm.deposit"
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              class="block w-full rounded-md border border-[var(--color-border-primary)] pl-10 pr-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Right Column - Pricing Structure -->
                      <div class="space-y-4">
                        <h4
                          class="font-medium text-sm text-[var(--color-text-primary)]"
                        >
                          Pricing Structure
                        </h4>

                        <!-- Pricing Type Selection -->
                        <div class="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            @click="themeForm.price_type = 1"
                            class="relative flex flex-col items-center p-4 border rounded-lg transition-all duration-200"
                            :class="[
                              themeForm.price_type == 1
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-bg-primary)]'
                                : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)/10]',
                            ]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-6 w-6 mb-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-16 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span class="font-medium">Fixed Price</span>
                            <span
                              class="text-xs mt-1"
                              :class="
                                themeForm.price_type == 1
                                  ? 'text-[var(--color-bg-primary)]'
                                  : 'text-[var(--color-text-muted)]'
                              "
                              >Single price for all bookings</span
                            >
                          </button>

                          <button
                            type="button"
                            @click="themeForm.price_type = 2"
                            class="relative flex flex-col items-center p-4 border rounded-lg transition-all duration-200"
                            :class="[
                              themeForm.price_type == 2
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-bg-primary)]'
                                : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)/10]',
                            ]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-6 w-6 mb-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span class="font-medium">Pax-based Price</span>
                            <span
                              class="text-xs mt-1"
                              :class="
                                themeForm.price_type === 2
                                  ? 'text-[var(--color-bg-primary)]'
                                  : 'text-[var(--color-text-muted)]'
                              "
                              >Different prices based on group size</span
                            >
                          </button>
                        </div>

                        <!-- Fixed Price Input -->
                        <div v-if="themeForm.price_type == 1" class="mt-4">
                          <label
                            class="block text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Price (MYR)
                          </label>
                          <div class="mt-1 relative rounded-md shadow-sm">
                            <div
                              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                              <span class="text-gray-500 sm:text-sm">RM</span>
                            </div>
                            <input
                              v-model.number="themeForm.price"
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              class="block w-full rounded-md border border-[var(--color-border-primary)] pl-10 pr-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <!-- Pax-based Price Inputs -->
                        <div v-if="themeForm.price_type == 2" class="mt-4">
                          <div class="flex items-center justify-between mb-2">
                            <label
                              class="block text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              Pax-based Prices
                            </label>
                            <button
                              type="button"
                              @click="addPaxPrice"
                              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                              Add Price Range
                            </button>
                          </div>

                          <div
                            class="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto"
                          >
                            <div
                              v-if="themeForm.pax_prices.length === 0"
                              class="text-center py-6"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-12 w-12 mx-auto text-gray-400 mb-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              <p class="text-sm text-[var(--color-text-muted)]">
                                No pax-based prices set
                              </p>
                              <p
                                class="text-xs text-[var(--color-text-muted)] mt-1"
                              >
                                Add price ranges for different group sizes
                              </p>
                            </div>

                            <div v-else class="space-y-3">
                              <div
                                v-for="(
                                  paxPrice, index
                                ) in themeForm.pax_prices"
                                :key="index"
                                class="flex items-start gap-4 p-3 bg-white rounded-lg border border-[var(--color-border-primary)] hover:border-[var(--color-primary)] transition-colors duration-200"
                              >
                                <div class="flex-1 grid grid-cols-3 gap-4">
                                  <div class="space-y-1">
                                    <label
                                      class="block text-xs font-medium text-[var(--color-text-primary)]"
                                      >Min Pax</label
                                    >
                                    <input
                                      v-model.number="paxPrice.min_pax"
                                      type="number"
                                      required
                                      placeholder="Min"
                                      class="block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-1.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                    />
                                  </div>
                                  <div class="space-y-1">
                                    <label
                                      class="block text-xs font-medium text-[var(--color-text-primary)]"
                                      >Max Pax</label
                                    >
                                    <input
                                      v-model.number="paxPrice.max_pax"
                                      type="number"
                                      required
                                      :min="paxPrice.min_pax"
                                      placeholder="Max"
                                      class="block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-1.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                    />
                                  </div>
                                  <div class="space-y-1">
                                    <label
                                      class="block text-xs font-medium text-[var(--color-text-primary)]"
                                      >Price (MYR)</label
                                    >
                                    <div class="relative">
                                      <input
                                        v-model.number="paxPrice.price"
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        class="block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-1.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  @click="removePaxPrice(index)"
                                  class="p-1.5 text-red-500 hover:bg-red-50 rounded-full"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clip-rule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="closeAddThemeModal"
                        class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        :disabled="isSaving"
                        class="inline-flex justify-center rounded-md border border-transparent bg-[var(--color-primary)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                        :class="{ 'opacity-75 cursor-not-allowed': isSaving }"
                      >
                        {{
                          isSaving
                            ? "Saving..."
                            : editingTheme
                            ? "Update Theme"
                            : "Add Theme"
                        }}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>

    <!-- Status Modal -->
    <StatusModal
      :is-open="modalState.isOpen"
      :status="modalState.status"
      :title="modalState.title"
      :message="modalState.message"
      @close="closeModal"
    />

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="showDeleteModal" as="template">
        <Dialog as="div" @close="closeDeleteModal" class="relative z-[100]">
          <!-- Backdrop -->
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div
              class="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />
          </TransitionChild>

          <!-- Modal Container -->
          <div class="fixed inset-0 overflow-y-auto">
            <div
              class="flex min-h-full items-center justify-center p-4 text-center"
            >
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle
                    as="h3"
                    class="text-base sm:text-lg font-medium leading-6 text-[var(--color-text-primary)]"
                  >
                    Delete Theme
                  </DialogTitle>
                  <div class="mt-2">
                    <p
                      class="text-xs sm:text-sm text-[var(--color-text-muted)]"
                    >
                      Are you sure you want to delete this theme? This action
                      cannot be undone.
                    </p>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeDeleteModal"
                      class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      @click="deleteTheme(themeToDelete)"
                      :disabled="isDeleting"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      :class="{ 'opacity-75 cursor-not-allowed': isDeleting }"
                    >
                      {{ isDeleting ? "Deleting..." : "Delete Theme" }}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>

    <!-- Pax Prices Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="showPaxPricesModal" as="template">
        <Dialog as="div" @close="closePaxPricesModal" class="relative z-[100]">
          <!-- Backdrop -->
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div
              class="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />
          </TransitionChild>

          <!-- Modal Container -->
          <div class="fixed inset-0 overflow-y-auto">
            <div
              class="flex min-h-full items-center justify-center p-4 text-center"
            >
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle
                    as="h3"
                    class="text-base sm:text-lg font-medium leading-6 text-[var(--color-text-primary)]"
                  >
                    Manage Pax-Based Prices
                  </DialogTitle>
                  <div class="mt-4 space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-[var(--color-text-muted)]">
                        {{ selectedTheme?.title }}
                      </span>
                      <button
                        type="button"
                        @click="addPaxPrice"
                        class="inline-flex items-center px-2 py-1 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        Add Price Range
                      </button>
                    </div>

                    <div class="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                      <div
                        v-for="(paxPrice, index) in paxPricesForm.pax_prices"
                        :key="index"
                        class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div class="grid grid-cols-3 gap-2 flex-1">
                          <div>
                            <input
                              v-model.number="paxPrice.min_pax"
                              type="number"
                              required
                              min="1"
                              placeholder="Min"
                              class="block w-full rounded-md border border-[var(--color-border-primary)] px-2 py-1.5 text-xs focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                            />
                            <span
                              class="text-[10px] text-[var(--color-text-muted)] mt-0.5"
                              >Min Pax</span
                            >
                          </div>
                          <div>
                            <input
                              v-model.number="paxPrice.max_pax"
                              type="number"
                              required
                              :min="paxPrice.min_pax"
                              placeholder="Max"
                              class="block w-full rounded-md border border-[var(--color-border-primary)] px-2 py-1.5 text-xs focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                            />
                            <span
                              class="text-[10px] text-[var(--color-text-muted)] mt-0.5"
                              >Max Pax</span
                            >
                          </div>
                          <div>
                            <input
                              v-model.number="paxPrice.price"
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              placeholder="Price"
                              class="block w-full rounded-md border border-[var(--color-border-primary)] px-2 py-1.5 text-xs focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                            />
                            <span
                              class="text-[10px] text-[var(--color-text-muted)] mt-0.5"
                              >Price (MYR)</span
                            >
                          </div>
                        </div>
                        <button
                          type="button"
                          @click="removePaxPrice(index)"
                          class="p-1.5 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="closePaxPricesModal"
                        class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        @click="savePaxPrices"
                        :disabled="isSaving"
                        class="inline-flex justify-center rounded-md border border-transparent bg-[var(--color-primary)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                        :class="{ 'opacity-75 cursor-not-allowed': isSaving }"
                      >
                        {{ isSaving ? "Saving..." : "Save Changes" }}
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>

    <!-- Date-Specific Prices Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="showDatePricesModal" as="template">
        <Dialog as="div" @close="closeDatePricesModal" class="relative z-[100]">
          <!-- Backdrop -->
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div
              class="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />
          </TransitionChild>

          <!-- Modal Container -->
          <div class="fixed inset-0 overflow-y-auto">
            <div
              class="flex min-h-full items-center justify-center p-4 text-center"
            >
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle
                    as="h3"
                    class="text-base sm:text-lg font-medium leading-6 text-[var(--color-text-primary)]"
                  >
                    Manage Date-Specific Prices
                  </DialogTitle>

                  <div class="mt-4 space-y-4">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between">
                      <div>
                        <h3
                          class="text-lg font-medium text-[var(--color-text-primary)]"
                        >
                          {{ selectedTheme?.title }}
                        </h3>
                        <p class="text-sm text-[var(--color-text-muted)]">
                          Set special prices for specific date ranges
                        </p>
                      </div>
                      <button
                        type="button"
                        @click="addDatePrice"
                        class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        Add Date Range
                      </button>
                    </div>

                    <!-- Date Prices List -->
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div
                        v-if="datePricesForm.date_prices.length === 0"
                        class="text-center py-6"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-12 w-12 mx-auto text-gray-400 mb-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p class="text-sm text-[var(--color-text-muted)]">
                          No date-specific prices set
                        </p>
                        <p class="text-xs text-[var(--color-text-muted)] mt-1">
                          Add special prices for specific date ranges
                        </p>
                      </div>

                      <div v-else class="space-y-3">
                        <div
                          v-for="(datePrice, index) in datePricesForm.date_prices"
                          :key="index"
                          class="group relative bg-white rounded-lg border border-[var(--color-border-primary)] hover:border-[var(--color-primary)] transition-all duration-200"
                        >
                          <!-- Delete Button - Absolute positioned -->
                          <button
                            type="button"
                            @click="removeDatePrice(index)"
                            class="absolute -top-2 -right-2 p-1.5 bg-white text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm border border-[var(--color-border-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </button>

                          <!-- Content -->
                          <div class="p-4 space-y-4">
                            <!-- Date Range Section -->
                            <div class="grid grid-cols-2 gap-4">
                              <div class="space-y-1">
                                <label
                                  class="block text-xs font-medium text-[var(--color-text-primary)]"
                                >
                                  Start Date
                                  <span class="text-red-500">*</span>
                                </label>
                                <input
                                  v-model="datePrice.start_date"
                                  type="date"
                                  required
                                  class="block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-1.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                />
                              </div>
                              <div class="space-y-1">
                                <label
                                  class="block text-xs font-medium text-[var(--color-text-primary)]"
                                >
                                  End Date
                                  <span class="text-red-500">*</span>
                                </label>
                                <input
                                  v-model="datePrice.end_date"
                                  type="date"
                                  required
                                  :min="datePrice.start_date"
                                  class="block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-1.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                />
                              </div>
                            </div>

                            <!-- Price Type and Amount Section -->
                            <div class="grid grid-cols-2 gap-4">
                              <div class="space-y-1">
                                <label
                                  class="block text-xs font-medium text-[var(--color-text-primary)]"
                                >
                                  Price Type
                                  <span class="text-red-500">*</span>
                                </label>
                                <select
                                  v-model="datePrice.price_type"
                                  class="block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-1.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                                >
                                  <option value="1">Fixed Amount</option>
                                  <option value="2">Percentage</option>
                                </select>
                              </div>

                              <div class="space-y-1">
                                <label
                                  class="block text-xs font-medium text-[var(--color-text-primary)]"
                                >
                                  {{ datePrice.price_type == 2 ? 'Percentage (%)' : 'Fixed Amount (MYR)' }}
                                  <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                  <div
                                    v-if="datePrice.price_type == 1"
                                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                  >
                                    <span class="text-gray-500 sm:text-sm">RM</span>
                                  </div>
                                  <input
                                    v-model.number="datePrice.amount"
                                    type="number"
                                    required
                                    :min="datePrice.price_type == 2 ? -100 : 0"
                                    :max="datePrice.price_type == 2 ? 100 : undefined"
                                    :step="datePrice.price_type == 2 ? 1 : 0.01"
                                    :placeholder="datePrice.price_type == 2 ? '0' : '0.00'"
                                    :class="[
                                      'block w-full rounded-md border border-[var(--color-border-primary)] py-1.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]',
                                      datePrice.price_type == 1 ? 'pl-10 pr-3' : 'px-3 pr-8'
                                    ]"
                                  />
                                  <div
                                    v-if="datePrice.price_type == 2"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                                  >
                                    <span class="text-gray-500 sm:text-sm">%</span>
                                  </div>
                                </div>
                                <p class="text-xs text-[var(--color-text-muted)] mt-1">
                                  {{ datePrice.price_type == 2 
                                    ? 'Negative value for discount, positive for surcharge' 
                                    : 'Enter the fixed amount for this date range' }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      @click="closeDatePricesModal"
                      class="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      @click="saveDateSpecificPrices"
                      :disabled="isLoading"
                      class="inline-flex justify-center rounded-md border border-transparent bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ isLoading ? "Saving..." : "Save Changes" }}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import StatusModal from "~/components/common/StatusModal.vue";
import type { ModalStatus } from "~/types/modal";

definePageMeta({
  layout: "dashboard",
});

const { $apiFetch } = useNuxtApp();

// Types
interface Theme {
  id: number;
  title: string;
  description: string;
  price_type: 1 | 2;
  price: number | null;
  specific_date: number | null;
  pax_prices?: PaxBasedPrice[];
  date_specific_prices?: DateSpecificPrice[];
  deposit: number;
  image?: string;
  is_active: boolean;
}

interface PaxBasedPrice {
  id?: number;
  min_pax: number;
  max_pax: number;
  price: number;
}

interface DateSpecificPrice {
  id?: number;
  start_date: string;
  end_date: string;
  price_type: 1 | 2;
  percentage?: number;
  amount?: number;
  is_active: boolean;
}

interface DatePrice {
  id?: number;
  start_date: string;
  end_date: string;
  price_type: 1 | 2;
  percentage?: number;
  amount?: number;
}

// Utility functions
function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "N/A";
  return `RM ${price.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// State
const themes = ref<Theme[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const showAddThemeModal = ref(false);
const isSaving = ref(false);
const editingTheme = ref<Theme | null>(null);
const showDeleteModal = ref(false);
const isDeleting = ref(false);
const themeToDelete = ref<Theme | null>(null);

// Add modalState with proper type
const modalState = ref<{
  isOpen: boolean;
  status: ModalStatus;
  title: string;
  message: string;
}>({
  isOpen: false,
  status: "success",
  title: "",
  message: "",
});

// Define form state interfaces
interface ThemeFormState {
  title: string;
  description: string;
  price_type: 1 | 2;
  price: number;
  deposit: number;
  image: string;
  pax_prices: PaxBasedPrice[];
}

interface PaxPricesFormState {
  pax_prices: PaxBasedPrice[];
}

interface DatePricesFormState {
  date_prices: DatePrice[];
}

// Update form refs with proper types
const themeForm = ref<ThemeFormState>({
  title: "",
  description: "",
  price_type: 1,
  price: 0,
  deposit: 0,
  image: "",
  pax_prices: [],
});

const paxPricesForm = ref<PaxPricesFormState>({
  pax_prices: [],
});

const datePricesForm = ref<DatePricesFormState>({
  date_prices: [],
});

// Add new state variables
const showPaxPricesModal = ref(false);
const showDatePricesModal = ref(false);
const selectedTheme = ref<Theme | null>(null);

// Methods
async function fetchThemes() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await $apiFetch("/api/booking/get-all-themes");

    console.log("response:", response);

    themes.value = response as Theme[];
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    isLoading.value = false;
  }

  console.log("isLoading:", isLoading.value);
}

function editTheme(theme: Theme) {
  editingTheme.value = theme;
  themeForm.value = {
    title: theme.title,
    description: theme.description,
    price_type: theme.price_type,
    price: theme.price || 0,
    deposit: theme.deposit,
    image: theme.image || "",
    pax_prices: theme.pax_prices || [],
  };
  showAddThemeModal.value = true;
}

async function toggleThemeStatus(theme: Theme) {
  try {
    isLoading.value = true;
    const response = await $apiFetch(
      `/api/booking/update-theme-status/${theme.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          status: !theme.is_active ? 1 : 0,
        }),
      }
    );

    // Update theme in the list
    const index = themes.value.findIndex((t) => t.id === theme.id);
    if (index !== -1) {
      themes.value[index] = {
        ...themes.value[index],
        is_active: !theme.is_active,
      };
    }

    modalState.value = {
      isOpen: true,
      status: "success",
      title: "Success",
      message: `Theme ${
        theme.is_active ? "deactivated" : "activated"
      } successfully`,
    };
  } catch (error) {
    console.error("Error toggling theme status:", error);
    modalState.value = {
      isOpen: true,
      status: "error",
      title: "Error",
      message: "Failed to update theme status",
    };
  } finally {
    isLoading.value = false;
  }
}

async function saveTheme() {
  if (!validateDateSpecificPrices()) {
    return;
  }

  isSaving.value = true;
  try {
    const endpoint = editingTheme.value
      ? `/api/booking/update-theme/${editingTheme.value.id}`
      : "/api/booking/create-theme";

    console.log("Data: ", themeForm.value);

    const response = await $apiFetch(endpoint, {
      method: editingTheme.value ? "PUT" : "POST",
      body: JSON.stringify(themeForm.value),
    });

    modalState.value = {
      isOpen: true,
      status: "success",
      title: "Success",
      message: `Theme ${
        editingTheme.value ? "updated" : "created"
      } successfully`,
    };
    closeAddThemeModal();
    await fetchThemes();
  } catch (err) {
    console.error("Error saving theme:", err);
  } finally {
    isSaving.value = false;
  }
}

function closeAddThemeModal() {
  showAddThemeModal.value = false;
  editingTheme.value = null;
  themeForm.value = {
    title: "",
    description: "",
    price_type: 1,
    price: 0,
    deposit: 0,
    image: "",
    pax_prices: [],
  };
}

function confirmDelete(theme: Theme) {
  themeToDelete.value = theme;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  themeToDelete.value = null;
}

async function deleteTheme(theme: Theme | null) {
  if (!theme) return;

  try {
    if (!confirm("Are you sure you want to delete this theme?")) {
      return;
    }

    isLoading.value = true;
    const response = await $apiFetch(`/api/booking/delete-theme/${theme.id}`, {
      method: "DELETE",
    });

    themes.value = themes.value.filter((t) => t.id !== theme.id);
    closeDeleteModal();

    modalState.value = {
      isOpen: true,
      status: "success",
      title: "Success",
      message: "Theme deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting theme:", error);
    modalState.value = {
      isOpen: true,
      status: "error",
      title: "Error",
      message: "Failed to delete theme",
    };
  } finally {
    isLoading.value = false;
  }
}

// Add new function to handle pax prices
function addPaxPrice() {
  const newPaxPrice = {
    min_pax: 1,
    max_pax: 10,
    price: 0,
  };

  if (showAddThemeModal.value) {
    // Adding pax price in the Add/Edit Theme modal
    themeForm.value.pax_prices.push({ ...newPaxPrice });
  } else if (showPaxPricesModal.value) {
    // Adding pax price in the Manage Pax Prices modal
    paxPricesForm.value.pax_prices.push({ ...newPaxPrice });
  }
}

function removePaxPrice(index: number) {
  if (showAddThemeModal.value) {
    // Removing pax price in the Add/Edit Theme modal
    themeForm.value.pax_prices.splice(index, 1);
  } else if (showPaxPricesModal.value) {
    // Removing pax price in the Manage Pax Prices modal
    paxPricesForm.value.pax_prices.splice(index, 1);
  }
}

// Add new functions for date-specific prices
function addDatePrice() {
  datePricesForm.value.date_prices.push({
    start_date: "",
    end_date: "",
    price_type: 1,
    percentage: 0,
    amount: 0,
  });
}

function removeDatePrice(index: number) {
  datePricesForm.value.date_prices.splice(index, 1);
}

function validateDateSpecificPrices(): boolean {
  console.log("Masuk validateDateSpecificPrices");
  

  const prices = datePricesForm.value.date_prices;

  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];

    if (!price.start_date || !price.end_date) {
      return false;
    }

    if (price.end_date < price.start_date) {
      return false;
    }

    if (price.price_type == 2) {
      if (
        !price.amount ||
        price.amount < -100 ||
        price.amount > 100
      ) {
        return false;
      }
    } else {
      if (!price.amount || price.amount < 0) {
        return false;
      }
    }
  }

  return true;
}

// Add new methods for managing pax prices
function managePaxPrices(theme: Theme) {
  selectedTheme.value = theme;
  paxPricesForm.value.pax_prices = [...(theme.pax_prices || [])];
  showPaxPricesModal.value = true;
}

function closePaxPricesModal() {
  showPaxPricesModal.value = false;
  selectedTheme.value = null;
  paxPricesForm.value.pax_prices = [];
}

async function savePaxPrices() {
  if (!selectedTheme.value) return;

  isSaving.value = true;
  try {
    await $apiFetch(
      `/api/booking/update-pax-prices/${selectedTheme.value.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          pax_prices: paxPricesForm.value.pax_prices,
        }),
      }
    );

    closePaxPricesModal();
    await fetchThemes();
  } catch (err) {
    console.error("Error updating pax prices:", err);
  } finally {
    isSaving.value = false;
  }
}

// Add new methods for managing date-specific prices
function adjustToMalaysiaTimezone(dateString: string): string {
  const date = new Date(dateString);
  // Add 8 hours to convert to Malaysia timezone
  date.setHours(date.getHours() + 8);
  return date.toISOString().split("T")[0];
}

function manageDateSpecificPrices(theme: Theme) {
  selectedTheme.value = theme;
  datePricesForm.value.date_prices =
    theme.date_specific_prices?.map((price) => ({
      id: price.id,
      start_date: adjustToMalaysiaTimezone(price.start_date),
      end_date: adjustToMalaysiaTimezone(price.end_date),
      price_type: price.price_type,
      percentage: price.percentage,
      amount: price.amount,
      is_active: price.is_active,
    })) || [];
  showDatePricesModal.value = true;
}

function closeDatePricesModal() {
  showDatePricesModal.value = false;
  selectedTheme.value = null;
  datePricesForm.value.date_prices = [];
}

async function saveDateSpecificPrices() {
  if (!selectedTheme.value || !validateDateSpecificPrices()) return;

  isSaving.value = true;

  console.log(
    "datePricesForm.value.date_prices:",
    datePricesForm.value.date_prices
  );

  try {
    await $apiFetch(
      `/api/booking/update-date-prices/${selectedTheme.value.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          date_prices: datePricesForm.value.date_prices,
        }),
      }
    );

    closeDatePricesModal();
    await fetchThemes();
  } catch (err) {
    console.error("Error updating date-specific prices:", err);
  } finally {
    isSaving.value = false;
  }
}

// Add closeModal function
function closeModal() {
  modalState.value = {
    isOpen: false,
    status: "success",
    title: "",
    message: "",
  };
}

// Add watch effect for price_type changes
watch(
  () => themeForm.value.price_type,
  (newType) => {
    if (newType === 2 && themeForm.value.pax_prices.length === 0) {
      // Initialize with a default pax price range when switching to pax-based pricing
      themeForm.value.pax_prices = [
        {
          min_pax: 1,
          max_pax: 10,
          price: 0,
        },
      ];
    }
  }
);

// Lifecycle
onMounted(() => {
  fetchThemes();
});
</script>

<style lang="scss" scoped></style>
