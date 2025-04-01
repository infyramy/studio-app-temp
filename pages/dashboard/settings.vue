<template>
  <div class="">
    <!-- Status Modal -->
    <StatusModal
      :is-open="modalState.isOpen"
      :status="modalState.status"
      :title="modalState.title"
      :message="modalState.message"
      @close="closeModal"
    />

    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <h1
        class="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)]"
      >
        Settings
      </h1>
      <p class="mt-1 sm:mt-2 text-sm text-[var(--color-text-secondary)]">
        Manage your booking system settings and account preferences
      </p>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden">
      <div class="settings-tabs">
        <!-- Tab Headers -->
        <nav class="tab-nav bg-white border-b border-gray-200 overflow-x-auto">
          <div class="flex items-center px-2 sm:px-4 gap-4 sm:gap-8 min-w-max">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="() => (activeTab = tab.name)"
              :class="[
                'tab-btn relative py-3 sm:py-4 text-sm font-medium transition-all duration-200 -mb-px whitespace-nowrap',
                activeTab === tab.name
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent',
              ]"
            >
              <div class="flex items-center gap-1.5 sm:gap-2">
                <component
                  :is="tab.icon"
                  class="w-4 h-4 sm:w-5 sm:h-5"
                  :class="
                    activeTab === tab.name
                      ? 'text-[var(--color-primary)]'
                      : 'text-gray-400'
                  "
                />
                <span>{{ tab.label }}</span>
              </div>
            </button>
          </div>
        </nav>

        <!-- Tab Content Background -->
        <div class="bg-gray-50 min-h-[400px]">
          <!-- Tab Panels -->
          <div class="tab-content p-3 sm:p-4">
            <!-- Booking Time & Slot Panel -->
            <div
              v-if="activeTab === TabName.BOOKING"
              key="booking"
              class="space-y-4 sm:space-y-6 relative"
            >
              <!-- Business Hours Section -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <!-- Date Range Section -->
                <div class="p-3 sm:p-4 border-b border-gray-100">
                  <h3
                    class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Booking Date Range
                  </h3>
                  <p
                    class="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]"
                  >
                    Set the date range for available booking slots
                  </p>
                </div>
                <div class="p-3 sm:p-4">
                  <div class="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Start Date
                      </label>
                      <div
                        class="relative"
                        :class="{ 'has-error': errors.startDate }"
                      >
                        <input
                          type="date"
                          v-model="settings.startDate"
                          :class="[
                            'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                            'pl-10 pr-4',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.startDate
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                          @change="handleDateChange"
                        />
                        <div
                          class="calendar-icon"
                          :class="{ error: errors.startDate }"
                        >
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                        <div v-if="errors.startDate" class="error-message">
                          {{ errors.startDate }}
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        End Date
                      </label>
                      <div
                        class="relative"
                        :class="{ 'has-error': errors.endDate }"
                      >
                        <input
                          type="date"
                          v-model="settings.endDate"
                          :class="[
                            'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                            'pl-10 pr-4',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.endDate
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                          @change="handleDateChange"
                        />
                        <div
                          class="calendar-icon"
                          :class="{ error: errors.endDate }"
                        >
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                        <div v-if="errors.endDate" class="error-message">
                          {{ errors.endDate }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Months Involved Display -->
                  <div
                    v-if="involvedMonths.length > 0"
                    class="mt-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <h4 class="text-sm font-medium text-gray-700 mb-2">
                      Months Involved:
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="month in involvedMonths"
                        :key="month"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)] text-white"
                      >
                        {{ month }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Business Hours Section -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-3 sm:p-4 border-b border-gray-100">
                  <h3
                    class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Business Hours
                  </h3>
                  <p
                    class="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]"
                  >
                    Set your business operating hours for booking slots
                  </p>
                </div>
                <div class="p-3 sm:p-4">
                  <div class="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >Opening Time</label
                      >
                      <div
                        class="relative time-input-wrapper"
                        :class="{ 'has-error': errors.openingTime }"
                      >
                        <input
                          type="time"
                          v-model="settings.openingTime"
                          :class="[
                            'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                            'pl-10 pr-4',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.openingTime
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                        />
                        <div
                          class="time-icon"
                          :class="{ error: errors.openingTime }"
                        >
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </div>
                        <div v-if="errors.openingTime" class="error-message">
                          {{ errors.openingTime }}
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                        >Closing Time</label
                      >
                      <div
                        class="relative time-input-wrapper"
                        :class="{ 'has-error': errors.closingTime }"
                      >
                        <input
                          type="time"
                          v-model="settings.closingTime"
                          :class="[
                            'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                            'pl-10 pr-4',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.closingTime
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                        />
                        <div
                          class="time-icon"
                          :class="{ error: errors.closingTime }"
                        >
                          <svg
                            class="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </div>
                        <div v-if="errors.closingTime" class="error-message">
                          {{ errors.closingTime }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Slot Duration Section -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Slot Duration & Rest Period
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Configure the duration of each booking slot and rest period
                    between sessions
                  </p>
                </div>
                <div class="p-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Session Duration
                      </label>
                      <select
                        v-model="settings.slotDuration"
                        class="block w-full rounded-md border-gray-300 pl-3 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                      >
                        <option :value="10">10 minutes</option>
                        <option :value="15">15 minutes</option>
                        <option :value="20">20 minutes</option>
                        <option :value="25">25 minutes</option>
                        <option :value="30">30 minutes</option>
                        <option :value="35">35 minutes</option>
                        <option :value="40">40 minutes</option>
                        <option :value="45">45 minutes</option>
                        <option :value="50">50 minutes</option>
                        <option :value="55">55 minutes</option>
                        <option :value="60">1 hour</option>
                      </select>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Rest Period Between Sessions
                      </label>
                      <select
                        v-model="settings.restDuration"
                        class="block w-full rounded-md border-gray-300 pl-3 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                      >
                        <option :value="0">No rest</option>
                        <option :value="5">5 minutes</option>
                        <option :value="10">10 minutes</option>
                        <option :value="15">15 minutes</option>
                        <option :value="30">30 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Break Time Section with mobile optimizations -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-3 sm:p-4 border-b border-gray-100">
                  <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <h3
                        class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
                      >
                        Break Times
                      </h3>
                      <p
                        class="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]"
                      >
                        Set multiple break time periods throughout the day
                      </p>
                    </div>
                    <button
                      @click="
                        settings.breakTimes.push({
                          id: null,
                          startTime: '',
                          endTime: '',
                        })
                      "
                      class="w-full sm:w-auto inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Add Break Time
                    </button>
                  </div>
                </div>
                <div class="p-3 sm:p-4">
                  <div class="space-y-4">
                    <TransitionGroup name="break-list">
                      <div
                        v-for="(breakTime, index) in settings.breakTimes"
                        :key="index"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg relative group"
                      >
                        <div class="space-y-2">
                          <label
                            class="block text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Break Start Time
                          </label>
                          <div class="relative time-input-wrapper">
                            <input
                              type="time"
                              v-model="breakTime.startTime"
                              :class="[
                                'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                                'pl-10 pr-4',
                                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                                errors[`breakTime${index}Start`]
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                                  : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                              ]"
                            />
                            <div
                              class="time-icon"
                              :class="{
                                error: errors[`breakTime${index}Start`],
                              }"
                            >
                              <svg
                                class="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg>
                            </div>
                            <div
                              v-if="errors[`breakTime${index}Start`]"
                              class="error-message"
                            >
                              {{ errors[`breakTime${index}Start`] }}
                            </div>
                          </div>
                        </div>
                        <div class="space-y-2">
                          <label
                            class="block text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Break End Time
                          </label>
                          <div class="relative time-input-wrapper">
                            <input
                              type="time"
                              v-model="breakTime.endTime"
                              :class="[
                                'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                                'pl-10 pr-4',
                                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                                errors[`breakTime${index}End`]
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                                  : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                              ]"
                            />
                            <div
                              class="time-icon"
                              :class="{ error: errors[`breakTime${index}End`] }"
                            >
                              <svg
                                class="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg>
                            </div>
                            <div
                              v-if="errors[`breakTime${index}End`]"
                              class="error-message"
                            >
                              {{ errors[`breakTime${index}End`] }}
                            </div>
                          </div>
                        </div>
                        <button
                          v-if="settings.breakTimes.length > 1"
                          @click="settings.breakTimes.splice(index, 1)"
                          class="absolute -right-2 -top-2 p-1 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
                      </div>
                    </TransitionGroup>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div
                class="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 flex justify-end"
              >
                <button
                  @click="saveSlotConfig"
                  :disabled="loadingStates.booking"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    v-if="loadingStates.booking"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{ loadingStates.booking ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>

            <div v-if="activeTab === TabName.NUMBER_OF_PAX">
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Number of Pax & Pricing
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Configure participant limits and pricing settings
                  </p>
                  <div
                    class="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100"
                  >
                    <p class="text-sm text-blue-700">
                      <span class="font-medium">Note:</span> These participant
                      and pricing settings will only take effect when using
                      fixed-price photography themes. For custom-priced or
                      variable-rate themes, these settings will not apply.
                    </p>
                  </div>
                </div>
                <div class="p-4">
                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Maximum Participants
                      </label>
                      <div class="relative">
                        <input
                          type="number"
                          v-model="settings.maxPax"
                          min="1"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.maxPax,
                          }"
                        />
                        <p
                          v-if="errors.maxPax"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.maxPax }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Maximum number of participants allowed per session
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Maximum Free Participants
                      </label>
                      <div class="relative">
                        <input
                          type="number"
                          v-model="settings.maxFreePax"
                          min="0"
                          :max="settings.maxPax"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.maxFreePax,
                          }"
                        />
                        <p
                          v-if="errors.maxFreePax"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.maxFreePax }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Number of participants that can join for free (0 for no
                        free participants)
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Charge Per Additional Participant
                      </label>
                      <div class="relative">
                        <div class="relative rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <span class="text-gray-500 sm:text-sm">{{
                              settings.currency
                            }}</span>
                          </div>
                          <input
                            type="number"
                            v-model="settings.chargePerPax"
                            min="0"
                            step="0.01"
                            class="block w-full rounded-md border border-gray-300 pl-16 pr-8 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                            :class="{
                              'border-red-300 focus:border-red-500 focus:ring-red-500':
                                errors.chargePerPax,
                            }"
                          />
                        </div>
                        <p
                          v-if="errors.chargePerPax"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.chargePerPax }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Amount to charge for each participant beyond the free
                        limit
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div
                class="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end mt-6"
              >
                <button
                  @click="savePaxSettings"
                  :disabled="loadingStates.pax"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    v-if="loadingStates.pax"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{ loadingStates.pax ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>

            <!-- Payment Gateway Panel -->
            <div
              v-if="activeTab === TabName.PAYMENT"
              key="payment"
              class="space-y-4 sm:space-y-6 relative"
            >
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 sm:p-8">
                  <div class="max-w-3xl mx-auto">
                    <!-- CHIP Integration Info -->
                    <div class="mb-6 sm:mb-8">
                      <div
                        class="flex flex-col sm:flex-row sm:items-center gap-3"
                      >
                        <img
                          src="https://www.chip-in.asia/images/Chip-logo.svg"
                          alt="CHIP"
                          class="h-6 sm:h-8"
                        />
                        <h3
                          class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
                        >
                          Payment Gateway Integration
                        </h3>
                      </div>
                      <p
                        class="mt-2 text-sm text-[var(--color-text-secondary)]"
                      >
                        Your payment processing is powered by CHIP, a secure and
                        reliable payment gateway that supports various payment
                        methods including FPX, credit cards, and e-wallets.
                      </p>
                    </div>

                    <!-- Payment Settings Form -->
                    <form
                      @submit.prevent="savePaymentConfig"
                      class="space-y-6 sm:space-y-8"
                    >
                      <!-- Payment Methods Section -->
                      <div class="border-b border-gray-200 pb-6 sm:pb-8">
                        <h4
                          class="text-base font-medium text-[var(--color-text-primary)] mb-4"
                        >
                          Payment Methods
                        </h4>

                        <!-- CHIP Payment Toggle -->
                        <div
                          class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-3 sm:gap-4"
                        >
                          <div class="flex-1">
                            <h5
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              CHIP Payment Gateway
                            </h5>
                            <p
                              class="text-sm text-[var(--color-text-secondary)]"
                            >
                              Enable online payments through CHIP payment
                              gateway
                            </p>
                          </div>
                          <label
                            class="relative inline-flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              class="sr-only peer"
                              :checked="settings.enableChip === 1"
                              @change="toggleChip"
                            />
                            <div
                              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"
                            ></div>
                          </label>
                        </div>

                        <!-- Manual Payment Toggle -->
                        <div
                          class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-3 sm:gap-4"
                        >
                          <div class="flex-1">
                            <h5
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              Manual Bank Transfer
                            </h5>
                            <p
                              class="text-sm text-[var(--color-text-secondary)]"
                            >
                              Accept manual bank transfers using organization's
                              bank details
                            </p>
                          </div>
                          <label
                            class="relative inline-flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              class="sr-only peer"
                              :checked="settings.enableManual === 1"
                              @change="toggleManual"
                            />
                            <div
                              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"
                            ></div>
                          </label>
                        </div>
                      </div>

                      <!-- Payment Amount Options Section -->
                      <div class="border-b border-gray-200 pb-6 sm:pb-8">
                        <h4
                          class="text-base font-medium text-[var(--color-text-primary)] mb-4"
                        >
                          Payment Amount Options
                        </h4>

                        <!-- Full Payment Toggle -->
                        <div
                          class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-3 sm:gap-4"
                        >
                          <div class="flex-1">
                            <h5
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              Full Payment
                            </h5>
                            <p
                              class="text-sm text-[var(--color-text-secondary)]"
                            >
                              Allow customers to pay the full amount
                            </p>
                          </div>
                          <label
                            class="relative inline-flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              class="sr-only peer"
                              :checked="settings.enableFullPayment === 1"
                              @change="toggleFullPayment"
                            />
                            <div
                              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"
                            ></div>
                          </label>
                        </div>

                        <!-- Deposit Payment Toggle -->
                        <div
                          class="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-3 sm:gap-4"
                        >
                          <div class="flex-1">
                            <h5
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              Deposit Payment
                            </h5>
                            <p
                              class="text-sm text-[var(--color-text-secondary)]"
                            >
                              Allow customers to pay deposit amount
                            </p>
                          </div>
                          <label
                            class="relative inline-flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              class="sr-only peer"
                              :checked="settings.enableDeposit === 1"
                              @change="toggleDeposit"
                            />
                            <div
                              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"
                            ></div>
                          </label>
                        </div>
                      </div>

                      <!-- CHIP Settings Section -->
                      <div v-if="settings.enableChip" class="space-y-6">
                        <h4
                          class="text-base font-medium text-[var(--color-text-primary)]"
                        >
                          CHIP Integration Settings
                        </h4>
                        <div class="grid grid-cols-1 gap-6">
                          <!-- Mode Selection -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Mode
                            </label>
                            <div class="flex flex-wrap gap-3">
                              <button
                                type="button"
                                @click="settings.chipMode = 'test'"
                                class="flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                                :class="[
                                  settings.chipMode === 'test'
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
                                ]"
                              >
                                Test Mode
                              </button>
                              <button
                                type="button"
                                @click="settings.chipMode = 'live'"
                                class="flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                                :class="[
                                  settings.chipMode === 'live'
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
                                ]"
                              >
                                Live Mode
                              </button>
                            </div>
                          </div>

                          <!-- Brand ID Input -->
                          <div>
                            <label
                              for="brand-id"
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Brand ID
                            </label>
                            <input
                              id="brand-id"
                              v-model="settings.chipBrandId"
                              type="text"
                              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm"
                              :class="{ 'border-red-300': errors.chipBrandId }"
                            />
                            <p
                              v-if="errors.chipBrandId"
                              class="mt-1 text-sm text-red-600"
                            >
                              {{ errors.chipBrandId }}
                            </p>
                          </div>

                          <!-- Secret Key Input -->
                          <div>
                            <label
                              for="secret-key"
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Secret Key
                            </label>
                            <div class="relative">
                              <input
                                id="secret-key"
                                v-model="settings.chipSecretKey"
                                :type="showChipKey ? 'text' : 'password'"
                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm pr-10"
                                :class="{
                                  'border-red-300': errors.chipSecretKey,
                                }"
                              />
                              <button
                                type="button"
                                @click="showChipKey = !showChipKey"
                                class="absolute inset-y-0 right-0 flex items-center pr-3"
                              >
                                <svg
                                  class="h-5 w-5 text-gray-400"
                                  :class="{
                                    'text-[var(--color-primary)]': showChipKey,
                                  }"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    v-if="showChipKey"
                                    d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                                  />
                                  <path
                                    v-if="showChipKey"
                                    d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z"
                                  />
                                  <path
                                    v-else
                                    d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                                  />
                                  <path
                                    v-else
                                    d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
                                  />
                                </svg>
                              </button>
                            </div>
                            <p
                              v-if="errors.chipSecretKey"
                              class="mt-1 text-sm text-red-600"
                            >
                              {{ errors.chipSecretKey }}
                            </p>
                            <p
                              class="mt-1 text-sm text-[var(--color-text-secondary)]"
                            >
                              Please use your
                              {{
                                settings.chipMode === "test" ? "test" : "live"
                              }}
                              secret key from CHIP dashboard.
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Payment Methods Selection -->
                      <!-- <div class="space-y-4">
                        <h4
                          class="text-base font-medium text-[var(--color-text-primary)]"
                        >
                          Available Payment Methods
                        </h4>
                        <div
                          class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200"
                        >
                          <div
                            v-for="method in paymentMethods"
                            :key="method.method"
                            class="flex items-center p-3 sm:p-4 hover:bg-gray-50"
                          >
                            <div class="flex items-center flex-1 min-w-0">
                              <input
                                type="checkbox"
                                :id="method.method"
                                :value="method.method"
                                v-model="settings.activePaymentMethods"
                                :disabled="!settings.enableChip"
                                class="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded disabled:opacity-50"
                              />
                              <label
                                :for="method.method"
                                class="ml-3 block text-sm font-medium text-gray-700 truncate cursor-pointer"
                                :class="{ 'opacity-50': !settings.enableChip }"
                              >
                                {{ method.title }}
                              </label>
                            </div>
                          </div>
                        </div>
                        <p class="text-sm text-[var(--color-text-secondary)]">
                          Select which payment methods to enable for CHIP
                          payments.
                          <span
                            v-if="!settings.enableChip"
                            class="text-[var(--color-text-muted)]"
                          >
                            (Enable CHIP Payment Gateway to select payment
                            methods)
                          </span>
                        </p>
                      </div> -->

                      <!-- Save Button -->
                      <div class="flex justify-end pt-4">
                        <button
                          type="submit"
                          :disabled="loadingStates.payment"
                          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          <svg
                            v-if="loadingStates.payment"
                            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          {{
                            loadingStates.payment ? "Saving..." : "Save Changes"
                          }}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <!-- Password Panel -->
            <div
              v-if="activeTab === TabName.PASSWORD"
              key="password"
              class="space-y-6 relative"
            >
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Change Password
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Update your account password
                  </p>
                </div>
                <div class="p-4">
                  <form
                    @submit.prevent="handlePasswordChange"
                    class="space-y-4 max-w-md"
                  >
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Current Password
                      </label>
                      <div
                        class="relative"
                        :class="{ 'has-error': errors.currentPassword }"
                      >
                        <input
                          :type="showCurrentPassword ? 'text' : 'password'"
                          v-model="passwordForm.currentPassword"
                          placeholder="Enter current password"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.currentPassword,
                          }"
                        />
                        <button
                          @click="showCurrentPassword = !showCurrentPassword"
                          type="button"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            v-if="showCurrentPassword"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                            />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        </button>
                      </div>
                      <p
                        v-if="errors.currentPassword"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ errors.currentPassword }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        New Password
                      </label>
                      <div
                        class="relative"
                        :class="{ 'has-error': errors.newPassword }"
                      >
                        <input
                          :type="showNewPassword ? 'text' : 'password'"
                          v-model="passwordForm.newPassword"
                          placeholder="Enter new password"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.newPassword,
                          }"
                        />
                        <button
                          @click="showNewPassword = !showNewPassword"
                          type="button"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            v-if="showNewPassword"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                            />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        </button>
                      </div>
                      <p
                        v-if="errors.newPassword"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ errors.newPassword }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Confirm New Password
                      </label>
                      <div
                        class="relative"
                        :class="{ 'has-error': errors.confirmPassword }"
                      >
                        <input
                          :type="showConfirmPassword ? 'text' : 'password'"
                          v-model="passwordForm.confirmPassword"
                          placeholder="Confirm new password"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.confirmPassword,
                          }"
                        />
                        <button
                          @click="showConfirmPassword = !showConfirmPassword"
                          type="button"
                          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            v-if="showConfirmPassword"
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                            />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        </button>
                      </div>
                      <p
                        v-if="errors.confirmPassword"
                        class="mt-1 text-sm text-red-600"
                      >
                        {{ errors.confirmPassword }}
                      </p>
                    </div>

                    <div class="pt-4">
                      <button
                        type="submit"
                        :disabled="isChangingPassword"
                        class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <svg
                          v-if="isChangingPassword"
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        {{
                          isChangingPassword
                            ? "Changing Password..."
                            : "Change Password"
                        }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- Google Calendar Panel -->
            <div
              v-if="activeTab === TabName.CALENDAR"
              key="calendar"
              class="space-y-4 sm:space-y-6 relative"
            >
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-3 sm:p-4 border-b border-gray-100">
                  <h3
                    class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Google Calendar Integration
                  </h3>
                  <p
                    class="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]"
                  >
                    Connect your Google Calendar to automatically create events
                    for new bookings
                  </p>
                </div>
                <div class="p-3 sm:p-4">
                  <div class="space-y-4">
                    <!-- Warning Message -->
                    <div
                      class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div class="flex items-start">
                        <div class="flex-shrink-0">
                          <svg
                            class="h-5 w-5 text-yellow-600"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                        <div class="ml-3">
                          <h4 class="text-sm font-medium text-yellow-800">
                            Sensitive Configuration
                          </h4>
                          <div class="mt-2 text-sm text-yellow-700">
                            <p>
                              These settings are critical for your calendar
                              integration. Please contact your technical team or
                              developer for any changes or issues with these
                              credentials.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Status -->
                    <div
                      class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          :class="[
                            'w-2.5 h-2.5 rounded-full',
                            isGoogleCalendarAuthorized
                              ? 'bg-green-500'
                              : 'bg-red-500',
                          ]"
                        />
                        <span class="text-sm font-medium text-gray-700">
                          {{
                            isGoogleCalendarAuthorized
                              ? "Connected"
                              : "Not Connected"
                          }}
                        </span>
                      </div>
                      <button
                        @click="handleConnectGoogleCalendar"
                        class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {{
                          isGoogleCalendarAuthorized ? "Reconnect" : "Connect"
                        }}
                      </button>
                    </div>

                    <!-- Google Calendar Credentials -->
                    <div
                      class="space-y-4 bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <h4 class="text-sm font-medium text-gray-900">
                        Google Calendar Credentials
                      </h4>

                      <!-- Client ID -->
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">
                          Client ID
                        </label>
                        <input
                          type="text"
                          v-model="settings.googleCalendar.clientId"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          placeholder="Enter Client ID"
                        />
                      </div>

                      <!-- Client Secret -->
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">
                          Client Secret
                        </label>
                        <input
                          type="password"
                          v-model="settings.googleCalendar.clientSecret"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          placeholder="Enter Client Secret"
                        />
                      </div>

                      <!-- Redirect URI -->
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">
                          Redirect URI
                        </label>
                        <input
                          type="text"
                          v-model="settings.googleCalendar.redirectUri"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          placeholder="Enter Redirect URI"
                        />
                      </div>

                      <!-- Refresh Token -->
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">
                          Refresh Token
                        </label>
                        <input
                          type="password"
                          v-model="settings.googleCalendar.refreshToken"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          placeholder="Enter Refresh Token"
                        />
                      </div>

                      <!-- Save Button -->
                      <div class="pt-4 flex justify-end">
                        <button
                          type="button"
                          @click="saveGoogleCalendarCredentials"
                          :disabled="loadingStates.googleCalendar"
                          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          <svg
                            v-if="loadingStates.googleCalendar"
                            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          {{
                            loadingStates.googleCalendar
                              ? "Saving..."
                              : "Save Credentials"
                          }}
                        </button>
                      </div>
                    </div>

                    <!-- Instructions -->
                    <div class="mt-6 bg-gray-50 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">
                        Important Notes:
                      </h4>
                      <ul class="space-y-2 text-sm">
                        <li class="flex items-center text-red-700">
                          <svg
                            class="h-4 w-4 mr-2 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          You must use your company email address to connect
                          Google Calendar
                        </li>
                        <li class="flex items-center text-red-700">
                          <svg
                            class="h-4 w-4 mr-2 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          The connected Google Calendar account must match your
                          company email
                        </li>
                        <li class="flex items-center text-gray-600">
                          <svg
                            class="h-4 w-4 mr-2 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          You'll need to reconnect if you haven't used the
                          system for 6 months
                        </li>
                        <li class="flex items-center text-gray-600">
                          <svg
                            class="h-4 w-4 mr-2 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          Events will be created in your primary Google Calendar
                        </li>
                        <li class="flex items-center text-gray-600">
                          <svg
                            class="h-4 w-4 mr-2 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          Clients will receive calendar invitations via email
                        </li>
                        <li class="flex items-center text-gray-600">
                          <svg
                            class="h-4 w-4 mr-2 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          For security reasons, only authorized personnel should
                          modify these settings
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- WhatsApp Panel -->
            <div
              v-if="activeTab === TabName.WHATSAPP"
              key="whatsapp"
              class="space-y-4 sm:space-y-6 relative"
            >
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-3 sm:p-4 border-b border-gray-100">
                  <h3
                    class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    WhatsApp Configuration
                  </h3>
                  <p
                    class="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]"
                  >
                    Configure your WhatsApp integration settings
                  </p>
                </div>
                <div class="p-3 sm:p-4">
                  <div class="space-y-4">
                    <!-- WAHA Endpoint -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        WAHA Endpoint
                      </label>
                      <div class="relative">
                        <input
                          type="url"
                          v-model="settings.wahaEndpoint"
                          placeholder="https://your-waha-endpoint.com"
                          :class="[
                            'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.wahaEndpoint
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                        />
                        <p
                          v-if="errors.wahaEndpoint"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.wahaEndpoint }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        The endpoint URL for your WAHA (WhatsApp HTTP API)
                        instance
                      </p>
                    </div>

                    <!-- Admin Phone Number -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Admin Phone Number
                      </label>
                      <div class="relative">
                        <input
                          type="tel"
                          v-model="settings.adminPhoneNumber"
                          placeholder="+60123456789"
                          :class="[
                            'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            errors.adminPhoneNumber
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                              : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                          ]"
                        />
                        <p
                          v-if="errors.adminPhoneNumber"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.adminPhoneNumber }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Your WhatsApp phone number with country code (e.g.,
                        60123456789)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div
                class="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 flex justify-end"
              >
                <button
                  @click="saveWhatsAppConfig"
                  :disabled="loadingStates.whatsapp"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    v-if="loadingStates.whatsapp"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{ loadingStates.whatsapp ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>

            <!-- Landing Page Panel -->
            <div
              v-if="activeTab === TabName.LANDING_PAGE"
              key="landing-page"
              class="space-y-4 sm:space-y-6 relative"
            >
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-4 border-b border-gray-100">
                  <h3
                    class="text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Landing Page Configuration
                  </h3>
                  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Configure your landing page settings
                  </p>
                </div>
                <div class="p-4">
                  <div class="space-y-4">
                    <!-- Title -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Title
                      </label>
                      <div class="relative">
                        <input
                          type="text"
                          v-model="settings.landingPage.title"
                          placeholder="Enter title"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.landingPageTitle,
                          }"
                        />
                        <p
                          v-if="errors.landingPageTitle"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.landingPageTitle }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        The title of your landing page
                      </p>
                    </div>

                    <!-- Description -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Description
                      </label>
                      <div class="relative">
                        <textarea
                          v-model="settings.landingPage.description"
                          placeholder="Enter description"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.landingPageDescription,
                          }"
                          rows="4"
                        ></textarea>
                        <p
                          v-if="errors.landingPageDescription"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.landingPageDescription }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        The description of your landing page
                      </p>
                    </div>

                    <!-- Button -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Button Text
                      </label>
                      <div class="relative">
                        <input
                          type="text"
                          v-model="settings.landingPage.button.text"
                          placeholder="Enter button text"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.landingPageButtonText,
                          }"
                        />
                        <p
                          v-if="errors.landingPageButtonText"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.landingPageButtonText }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        The text for your secondary button
                      </p>
                    </div>

                    <!-- Redirect URL -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Redirect URL
                      </label>
                      <div class="relative">
                        <input
                          type="url"
                          v-model="settings.landingPage.button.redirectUrl"
                          placeholder="https://example.com"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.landingPageButtonRedirectUrl,
                          }"
                        />
                        <p
                          v-if="errors.landingPageButtonRedirectUrl"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.landingPageButtonRedirectUrl }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        The URL to redirect to when the button is clicked
                      </p>
                    </div>

                    <!-- Image 1 -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Image 1
                      </label>
                      <div class="relative">
                        <input
                          type="url"
                          v-model="settings.landingPage.image1"
                          placeholder="https://example.com"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.landingPageImage1,
                          }"
                        />
                        <p
                          v-if="errors.landingPageImage1"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.landingPageImage1 }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        The image for your landing page
                      </p>
                    </div>

                    <!-- Image 2 -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Image 2
                      </label>
                      <div class="relative">
                        <input
                          type="url"
                          v-model="settings.landingPage.image2"
                          placeholder="https://example.com"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.landingPageImage2,
                          }"
                        />
                        <p
                          v-if="errors.landingPageImage2"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.landingPageImage2 }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        The image for your landing page
                      </p>
                    </div>

                    <!-- Image 3 -->
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Image 3
                      </label>
                      <div class="relative">
                        <input
                          type="url"
                          v-model="settings.landingPage.image3"
                          placeholder="https://example.com"
                          class="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.landingPageImage3,
                          }"
                        />
                        <p
                          v-if="errors.landingPageImage3"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.landingPageImage3 }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        The image for your landing page
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div
                class="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 flex justify-end"
              >
                <button
                  @click="saveLandingPageSettings"
                  :disabled="loadingStates.landingPage"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    v-if="loadingStates.landingPage"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{ loadingStates.landingPage ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>

            <!-- Terms & Conditions Panel -->
            <div
              v-if="activeTab === TabName.TERMS"
              key="terms"
              class="space-y-4 sm:space-y-6 relative"
            >
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-3 sm:p-4 border-b border-gray-100">
                  <h3
                    class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
                  >
                    Terms & Conditions
                  </h3>
                  <p
                    class="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]"
                  >
                    Manage your booking terms and conditions content
                  </p>
                </div>
                <div class="p-3 sm:p-4">
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <label
                        class="block text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Content (Supports Markdown)
                      </label>
                      <div class="relative space-y-4">
                        <textarea
                          v-model="settings.termsAndConditions"
                          placeholder="Enter your terms and conditions using Markdown
Example:
# Section 1
1. First point
2. Second point

## Subsection
* Bullet point 1
* Bullet point 2"
                          rows="15"
                          class="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm transition-all duration-200 bg-white hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-50 font-mono"
                          :class="{
                            'border-red-300 focus:border-red-500 focus:ring-red-500':
                              errors.termsAndConditions,
                          }"
                        ></textarea>
                        <div
                          v-if="settings.termsAndConditions"
                          class="p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none"
                        >
                          <h4 class="text-sm font-medium text-gray-900 mb-2">
                            Preview:
                          </h4>
                          <VueMarkdown :source="settings.termsAndConditions" />
                        </div>
                        <p
                          v-if="errors.termsAndConditions"
                          class="mt-1 text-sm text-red-600"
                        >
                          {{ errors.termsAndConditions }}
                        </p>
                      </div>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Use Markdown for formatting: # for headings, 1. for
                        numbered lists, * for bullet points, and blank lines for
                        paragraphs
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div
                class="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 flex justify-end"
              >
                <button
                  @click="saveTermsAndConditions"
                  :disabled="loadingStates.terms"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    v-if="loadingStates.terms"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{ loadingStates.terms ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>

            <!-- Holiday Panel -->
            <div
              v-if="activeTab === TabName.HOLIDAY"
              key="holiday"
              class="space-y-4 sm:space-y-6 relative"
            >
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
                <div class="p-3 sm:p-4 border-b border-gray-100">
                  <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <h3
                        class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
                      >
                        Studio Holidays
                      </h3>
                      <p
                        class="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]"
                      >
                        Manage dates when the studio will be closed
                      </p>
                    </div>
                    <button
                      @click="addHoliday"
                      class="w-full sm:w-auto inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Add Holiday
                    </button>
                  </div>
                </div>
                <div class="p-3 sm:p-4">
                  <div class="space-y-4">
                    <TransitionGroup name="holiday-list">
                      <div
                        v-for="(holiday, index) in settings.holidays"
                        :key="index"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg relative group"
                      >
                        <!-- Date Range -->
                        <div class="space-y-2">
                          <label
                            class="block text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Date Range
                          </label>
                          <div class="grid grid-cols-2 gap-2">
                            <div class="relative">
                              <input
                                type="date"
                                v-model="holiday.startDate"
                                :min="today"
                                :class="[
                                  'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                                  'pl-10 pr-4',
                                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                                  errors[`holiday${index}Start`]
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                                ]"
                                @change="validateHolidayDates"
                              />
                              <div
                                class="calendar-icon"
                                :class="{
                                  error: errors[`holiday${index}Start`],
                                }"
                              >
                                <svg
                                  class="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                >
                                  <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                  />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                              </div>
                            </div>
                            <div class="relative">
                              <input
                                type="date"
                                v-model="holiday.endDate"
                                :min="holiday.startDate || today"
                                :class="[
                                  'block w-full rounded-md border py-2.5 text-sm transition-all duration-200 bg-white',
                                  'pl-10 pr-4',
                                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                                  errors[`holiday${index}End`]
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                                ]"
                                @change="validateHolidayDates"
                              />
                              <div
                                class="calendar-icon"
                                :class="{ error: errors[`holiday${index}End`] }"
                              >
                                <svg
                                  class="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                >
                                  <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                  />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Description -->
                        <div class="space-y-2">
                          <label
                            class="block text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            Description
                          </label>
                          <input
                            type="text"
                            v-model="holiday.description"
                            placeholder="e.g., Public Holiday, Studio Maintenance"
                            :class="[
                              'block w-full rounded-md border py-2.5 px-3 text-sm transition-all duration-200 bg-white',
                              'focus:outline-none focus:ring-2 focus:ring-offset-0',
                              errors[`holiday${index}Description`]
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                                : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                            ]"
                          />
                        </div>

                        <!-- Delete Button -->
                        <button
                          @click="removeHoliday(index)"
                          class="absolute -right-2 -top-2 p-1 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
                      </div>
                    </TransitionGroup>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div
                class="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 flex justify-end"
              >
                <button
                  @click="saveHolidays"
                  :disabled="loadingStates.holiday"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg
                    v-if="loadingStates.holiday"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {{ loadingStates.holiday ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <template
      v-if="isLoading"
      class="absolute inset-0 bg-white/80 z-50 flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"
        ></div>
        <p class="text-sm text-gray-600">Loading settings...</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue";
definePageMeta({
  layout: "dashboard",
});

import StatusModal from "~/components/common/StatusModal.vue";
import type { FetchError } from "ofetch";
import VueMarkdown from "vue-markdown-render";

const { $apiFetch } = useNuxtApp();
const config = useRuntimeConfig();

interface BreakTime {
  id: number | null;
  startTime: string;
  endTime: string;
}

interface Holiday {
  id?: number | null;
  startDate: string;
  endDate: string;
  description: string;
}

interface LandingPage {
  title: string;
  description: string;
  button: {
    text: string;
    redirectUrl: string;
  };
  image1: string;
  image2: string;
  image3: string;
}

interface Settings {
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  restDuration: number;
  startDate: string;
  endDate: string;
  breakTimes: any[];
  chargePerPax: number;
  maxFreePax: number;
  maxPax: number;
  wahaEndpoint: string;
  adminPhoneNumber: string;
  landingPage: LandingPage;
  termsAndConditions: string;
  holidays: any[];
  googleCalendar: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken: string;
  };
  paymentProvider: string;
  apiKey: string;
  webhookSecret: string;
  testMode: boolean;
  currency: string;
  chipMode: string;
  chipBrandId: string;
  chipSecretKey: string;
  enableChip: number;
  enableManual: number;
  enableFullPayment: number;
  enableDeposit: number;
  activePaymentMethods: string[];
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse {
  statusCode: number;
  message?: string;
  data?: {
    slotConfig?: {
      start_time: string;
      end_time: string;
      duration: number;
      rest: number;
      start_date?: string;
      end_date?: string;
    };
    breaks?: Array<{
      id: number;
      start_time: string;
      end_time: string;
    }>;
    chargePerPax?: number;
    maxFreePax?: number;
    maxPax?: number;
    wahaEndpoint?: string;
    adminPhoneNumber?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    redirectUrl?: string;
    lpImg1?: string;
    lpImg2?: string;
    lpImg3?: string;
    content?: string;
    chipMode?: string;
    chipBrandId?: string;
    chipSecretKey?: string;
    enableChip?: number;
    enableManual?: number;
    enableFullPayment?: number;
    enableDeposit?: number;
  };
}

interface Errors {
  openingTime?: string;
  closingTime?: string;
  apiKey?: string;
  webhookSecret?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  maxPax?: string;
  maxFreePax?: string;
  chargePerPax?: string;
  waitlistLimit?: string;
  wahaEndpoint?: string;
  adminPhoneNumber?: string;
  [key: string]: string | undefined; // Add index signature for dynamic break time errors
  startDate?: string;
  endDate?: string;
  termsAndConditions?: string; // Add new field
  chipBrandId?: string;
  chipSecretKey?: string;
}

type ModalStatus = "success" | "error";

const TabName = {
  BOOKING: "booking",
  NUMBER_OF_PAX: "number-of-pax",
  PASSWORD: "password",
  PAYMENT: "payment",
  CALENDAR: "calendar",
  WHATSAPP: "whatsapp",
  LANDING_PAGE: "landing-page",
  TERMS: "terms",
  HOLIDAY: "holiday", // Add this line
} as const;

type TabNameType = (typeof TabName)[keyof typeof TabName];

const tabs = [
  {
    name: TabName.LANDING_PAGE,
    label: "Landing Page",
    icon: defineComponent({
      render() {
        return h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            class: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("path", { d: "M12 19l7-7 3 3-7 7-3-3z" }),
            h("path", { d: "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" }),
            h("path", { d: "M2 2l7.586 7.586" }),
            h("circle", { cx: "11", cy: "11", r: "2" }),
          ]
        );
      },
    }),
  },
  // Add Terms & Conditions tab right after Landing Page
  {
    name: TabName.TERMS,
    label: "Terms & Conditions",
    icon: defineComponent({
      render() {
        return h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            class: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("path", {
              d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
            }),
            h("polyline", { points: "14 2 14 8 20 8" }),
            h("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
            h("line", { x1: "16", y1: "17", x2: "8", y2: "17" }),
            h("line", { x1: "10", y1: "9", x2: "8", y2: "9" }),
          ]
        );
      },
    }),
  },
  {
    name: TabName.BOOKING,
    label: "Booking Time & Slot",
    icon: defineComponent({
      render() {
        return h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            class: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("rect", {
              x: "3",
              y: "4",
              width: "18",
              height: "18",
              rx: "2",
              ry: "2",
            }),
            h("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
            h("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
            h("line", { x1: "3", y1: "10", x2: "21", y2: "10" }),
          ]
        );
      },
    }),
  },
  {
    name: TabName.HOLIDAY,
    label: "Holidays",
    icon: defineComponent({
      render() {
        return h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            class: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("rect", {
              x: "3",
              y: "4",
              width: "18",
              height: "18",
              rx: "2",
              ry: "2",
            }),
            h("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
            h("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
            h("line", { x1: "3", y1: "10", x2: "21", y2: "10" }),
            h("path", { d: "M8 14h.01" }),
            h("path", { d: "M12 14h.01" }),
            h("path", { d: "M16 14h.01" }),
            h("path", { d: "M8 18h.01" }),
            h("path", { d: "M12 18h.01" }),
            h("path", { d: "M16 18h.01" }),
          ]
        );
      },
    }),
  },
  {
    name: TabName.NUMBER_OF_PAX,
    label: "Number of Pax",
    icon: defineComponent({
      render() {
        return h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            class: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("rect", {
              x: "3",
              y: "4",
              width: "18",
              height: "18",
              rx: "2",
              ry: "2",
            }),
            h("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
            h("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
            h("line", { x1: "3", y1: "10", x2: "21", y2: "10" }),
          ]
        );
      },
    }),
  },
  {
    name: TabName.PAYMENT,
    label: "Payment Gateway",
    icon: defineComponent({
      render() {
        return h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            class: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("rect", {
              x: "1",
              y: "4",
              width: "22",
              height: "16",
              rx: "2",
              ry: "2",
            }),
            h("line", { x1: "1", y1: "10", x2: "23", y2: "10" }),
          ]
        );
      },
    }),
  },
  {
    name: TabName.PASSWORD,
    label: "Password",
    icon: defineComponent({
      render() {
        return h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            class: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("rect", {
              x: "3",
              y: "11",
              width: "18",
              height: "11",
              rx: "2",
              ry: "2",
            }),
            h("path", { d: "M7 11V7a5 5 0 0110 0v4" }),
          ]
        );
      },
    }),
  },
  {
    name: TabName.CALENDAR,
    label: "Google Calendar",
    icon: defineComponent({
      render() {
        return h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            class: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("rect", {
              x: "3",
              y: "11",
              width: "18",
              height: "11",
              rx: "2",
              ry: "2",
            }),
            h("path", { d: "M7 11V7a5 5 0 0110 0v4" }),
          ]
        );
      },
    }),
  },
  {
    name: TabName.WHATSAPP,
    label: "WhatsApp",
    icon: defineComponent({
      render() {
        return h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            class: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("path", {
              d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
            }),
          ]
        );
      },
    }),
  },
] as const;

const activeTab = ref<TabNameType>(TabName.LANDING_PAGE);
const showApiKey = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const showChipKey = ref(false);

const landingPage = ref({
  title: "",
  description: "",
  button: {
    text: "",
    redirectUrl: "",
  },
  image1: "",
  image2: "",
  image3: "",
});
// Settings state
const settings = ref<Settings>({
  openingTime: "",
  closingTime: "",
  slotDuration: 60,
  restDuration: 0,
  startDate: "",
  endDate: "",
  breakTimes: [],
  chargePerPax: 0,
  maxFreePax: 0,
  maxPax: 0,
  wahaEndpoint: "",
  adminPhoneNumber: "",
  landingPage: {
    title: "",
    description: "",
    button: {
      text: "",
      redirectUrl: "",
    },
    image1: "",
    image2: "",
    image3: "",
  },
  termsAndConditions: "",
  holidays: [],
  googleCalendar: {
    clientId: "",
    clientSecret: "",
    redirectUri: "",
    refreshToken: "",
  },
  paymentProvider: "",
  apiKey: "",
  webhookSecret: "",
  testMode: false,
  currency: "",
  chipMode: "test",
  chipBrandId: "",
  chipSecretKey: "",
  enableChip: 0,
  enableManual: 0,
  enableFullPayment: 0,
  enableDeposit: 0,
  activePaymentMethods: [],
});

const paymentMethods = ref<PaymentMethodData[]>([]);

// Password change form
const passwordForm = ref<PasswordForm>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Add form validation
const errors = ref<Errors>({});

// Add modal state
const modalState = ref({
  isOpen: false,
  status: "success" as ModalStatus,
  title: "",
  message: "",
});

const isLoading = ref(true);
const isSaving = ref(false);
const isChangingPassword = ref(false);

// Add loading states for each tab
const loadingStates = ref({
  booking: false,
  pax: false,
  password: false,
  whatsapp: false,
  landingPage: false,
  terms: false,
  holiday: false,
  googleCalendar: false,
  payment: false,
});

// Add these near other ref declarations
const isGoogleCalendarAuthorized = ref(false);

function showModal(status: ModalStatus, title: string, message: string) {
  modalState.value = {
    isOpen: true,
    status,
    title,
    message,
  };
}

function closeModal() {
  modalState.value.isOpen = false;
}

// Validate time ranges
function validateTimeRanges() {
  errors.value = {};

  const opening = new Date(`2000-01-01T${settings.value.openingTime}`);
  const closing = new Date(`2000-01-01T${settings.value.closingTime}`);

  if (closing <= opening) {
    errors.value.closingTime = "Closing time must be after opening time";
  }

  // Validate date range
  if (!settings.value.startDate) {
    errors.value.startDate = "Start date is required";
  }

  if (!settings.value.endDate) {
    errors.value.endDate = "End date is required";
  }

  if (settings.value.startDate && settings.value.endDate) {
    const startDate = new Date(settings.value.startDate);
    const endDate = new Date(settings.value.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      errors.value.startDate = "Start date cannot be in the past";
    }

    if (endDate < startDate) {
      errors.value.endDate = "End date must be after start date";
    }
  }

  // Validate each break time
  settings.value.breakTimes.forEach((breakTime, index) => {
    const breakStart = new Date(`2000-01-01T${breakTime.startTime}`);
    const breakEnd = new Date(`2000-01-01T${breakTime.endTime}`);

    if (breakEnd <= breakStart) {
      errors.value[`breakTime${index}End`] =
        "Break end time must be after break start time";
    }
    if (breakStart < opening) {
      errors.value[`breakTime${index}Start`] =
        "Break must be within business hours";
    }
    if (breakEnd > closing) {
      errors.value[`breakTime${index}End`] =
        "Break must be within business hours";
    }

    // Check for overlapping breaks
    settings.value.breakTimes.forEach((otherBreak, otherIndex) => {
      if (index !== otherIndex) {
        const otherStart = new Date(`2000-01-01T${otherBreak.startTime}`);
        const otherEnd = new Date(`2000-01-01T${otherBreak.endTime}`);

        if (
          (breakStart >= otherStart && breakStart < otherEnd) ||
          (breakEnd > otherStart && breakEnd <= otherEnd) ||
          (breakStart <= otherStart && breakEnd >= otherEnd)
        ) {
          errors.value[`breakTime${index}Start`] = "Break times cannot overlap";
          errors.value[`breakTime${index}End`] = "Break times cannot overlap";
        }
      }
    });
  });
}

// Watch for time changes
watch(
  [
    () => settings.value.openingTime,
    () => settings.value.closingTime,
    () => settings.value.breakTimes,
  ],
  validateTimeRanges,
  { deep: true }
);

// Add validation for password change
const validatePasswordChange = () => {
  const passwordErrors: Errors = {};

  if (!passwordForm.value.currentPassword) {
    passwordErrors.currentPassword = "Current password is required";
  }

  if (!passwordForm.value.newPassword) {
    passwordErrors.newPassword = "New password is required";
  } else if (passwordForm.value.newPassword.length < 8) {
    passwordErrors.newPassword = "Password must be at least 8 characters";
  }

  if (!passwordForm.value.confirmPassword) {
    passwordErrors.confirmPassword = "Please confirm your password";
  } else if (
    passwordForm.value.confirmPassword !== passwordForm.value.newPassword
  ) {
    passwordErrors.confirmPassword = "Passwords do not match";
  }

  return passwordErrors;
};

async function fetchConfig() {
  try {
    isLoading.value = true;
    const [
      slotResponse,
      whatsappResponse,
      landingPageResponse,
      termsResponse,
      paymentResponse,
      // paymentMethodsResponse,
    ] = await Promise.all([
      $apiFetch("/api/setting/get-configs") as Promise<ApiResponse>,
      $apiFetch("/api/setting/get-whatsapp-config") as Promise<ApiResponse>,
      $apiFetch("/api/setting/get-landing-page") as Promise<ApiResponse>,
      $apiFetch("/api/setting/get-terms") as Promise<ApiResponse>,
      $apiFetch("/api/setting/get-payment-config") as Promise<ApiResponse>,
      // $apiFetch("/api/setting/get-payment-methods") as Promise<ApiResponse>,
    ]);

    if (slotResponse.statusCode === 200 && slotResponse.data) {
      if (slotResponse.data.slotConfig) {
        settings.value = {
          ...settings.value,
          openingTime: slotResponse.data.slotConfig.start_time,
          closingTime: slotResponse.data.slotConfig.end_time,
          slotDuration: slotResponse.data.slotConfig.duration,
          restDuration: slotResponse.data.slotConfig.rest,
          startDate: formatDateToLocal(slotResponse.data.slotConfig.start_date),
          endDate: formatDateToLocal(slotResponse.data.slotConfig.end_date),
          breakTimes: Array.isArray(slotResponse.data.breaks)
            ? slotResponse.data.breaks.map((breakTime) => ({
                id: breakTime.id,
                startTime: breakTime.start_time,
                endTime: breakTime.end_time,
              }))
            : [],
        };

        // Calculate involved months if dates are set
        if (settings.value.startDate && settings.value.endDate) {
          handleDateChange();
        }
      }

      if (slotResponse.data.chargePerPax !== undefined) {
        settings.value.chargePerPax = slotResponse.data.chargePerPax;
      }
      if (slotResponse.data.maxFreePax !== undefined) {
        settings.value.maxFreePax = slotResponse.data.maxFreePax;
      }
      if (slotResponse.data.maxPax !== undefined) {
        settings.value.maxPax = slotResponse.data.maxPax;
      }
    }

    if (whatsappResponse.statusCode === 200 && whatsappResponse.data) {
      settings.value.wahaEndpoint = whatsappResponse.data.wahaEndpoint || "";
      settings.value.adminPhoneNumber =
        whatsappResponse.data.adminPhoneNumber || "";
    }

    if (landingPageResponse.statusCode === 200 && landingPageResponse.data) {
      settings.value.landingPage = {
        title: landingPageResponse.data.title || "",
        description: landingPageResponse.data.description || "",
        button: {
          text: landingPageResponse.data.buttonText || "",
          redirectUrl: landingPageResponse.data.redirectUrl || "",
        },
        image1: landingPageResponse.data.lpImg1 || "",
        image2: landingPageResponse.data.lpImg2 || "",
        image3: landingPageResponse.data.lpImg3 || "",
      };
    }

    if (termsResponse.statusCode === 200 && termsResponse.data) {
      settings.value.termsAndConditions = termsResponse.data.content || "";
    }

    if (paymentResponse.statusCode === 200 && paymentResponse.data) {
      console.log("paymentResponse: ", paymentResponse.data);

      settings.value.enableChip =
        parseInt(String(paymentResponse.data.enableChip)) || 0;
      settings.value.enableManual =
        parseInt(String(paymentResponse.data.enableManual)) || 0;
      settings.value.enableFullPayment =
        parseInt(String(paymentResponse.data.enableFullPayment)) || 0;
      settings.value.enableDeposit =
        parseInt(String(paymentResponse.data.enableDeposit)) || 0;

      settings.value.chipMode = paymentResponse.data.chipMode || "test";
      settings.value.chipBrandId = paymentResponse.data.chipBrandId || "";
      settings.value.chipSecretKey = paymentResponse.data.chipSecretKey || "";

      // Handle active payment methods as comma-separated string
      const activeMethodsStr = String(
        paymentResponse.data?.activePaymentMethods || ""
      );
      console.log("Active methods string:", activeMethodsStr);
      settings.value.activePaymentMethods = activeMethodsStr.trim()
        ? activeMethodsStr
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean)
        : [];
      console.log(
        "Parsed active methods:",
        settings.value.activePaymentMethods
      );
    }

    // if (paymentMethodsResponse.statusCode === 200 && paymentMethodsResponse.data) {
    //   paymentMethods.value = paymentMethodsResponse.data;
    // }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to load settings"
    );
  } finally {
    isLoading.value = false;
  }
}

async function saveSlotConfig() {
  try {
    loadingStates.value.booking = true;

    // Validate all break times are filled
    const hasEmptyBreakTimes = settings.value.breakTimes.some(
      (breakTime) => !breakTime.startTime || !breakTime.endTime
    );

    if (hasEmptyBreakTimes) {
      showModal("error", "Error", "Please fill in all break time fields");
      return;
    }

    // Validate time ranges before saving
    validateTimeRanges();
    if (Object.keys(errors.value).length > 0) {
      showModal(
        "error",
        "Error",
        "Please fix the validation errors before saving"
      );
      return;
    }

    // Format dates to ISO string for API
    const startDate = settings.value.startDate
      ? new Date(settings.value.startDate)
      : null;
    const endDate = settings.value.endDate
      ? new Date(settings.value.endDate)
      : null;

    const response = (await $apiFetch("/api/setting/update-slot-config", {
      method: "POST",
      body: {
        start_time: settings.value.openingTime,
        end_time: settings.value.closingTime,
        breaks: settings.value.breakTimes.map((breakTime) => ({
          id: breakTime.id,
          start_time: breakTime.startTime,
          end_time: breakTime.endTime,
        })),
        duration: settings.value.slotDuration,
        rest: settings.value.restDuration,
        start_date: startDate ? startDate.toISOString() : null,
        end_date: endDate ? endDate.toISOString() : null,
      },
    })) as ApiResponse;

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "Slot configuration has been updated successfully"
      );
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update slot configuration"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update slot configuration"
    );
  } finally {
    loadingStates.value.booking = false;
  }
}

async function savePaxSettings() {
  try {
    loadingStates.value.pax = true;

    // Validate pax settings
    if (settings.value.maxPax < 1) {
      errors.value.maxPax = "Maximum participants must be at least 1";
      return;
    }

    if (settings.value.maxFreePax < 0) {
      errors.value.maxFreePax = "Maximum free participants cannot be negative";
      return;
    }

    if (settings.value.maxFreePax > settings.value.maxPax) {
      errors.value.maxFreePax =
        "Maximum free participants cannot exceed maximum participants";
      return;
    }

    if (settings.value.chargePerPax < 0) {
      errors.value.chargePerPax = "Charge per participant cannot be negative";
      return;
    }

    const response = (await $apiFetch("/api/setting/update-pax-config", {
      method: "PUT",
      body: {
        maxPax: settings.value.maxPax,
        maxFreePax: settings.value.maxFreePax,
        chargePerPax: settings.value.chargePerPax,
      },
    })) as ApiResponse;

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "Participant settings have been updated successfully"
      );
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update participant settings"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update participant settings"
    );
  } finally {
    loadingStates.value.pax = false;
  }
}

async function handlePasswordChange() {
  try {
    isChangingPassword.value = true;

    // Validate password change
    const passwordErrors = validatePasswordChange();
    if (Object.keys(passwordErrors).length > 0) {
      errors.value = { ...errors.value, ...passwordErrors };
      return;
    }

    const response = (await $apiFetch("/api/setting/update-password", {
      method: "POST",
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
        confirmPassword: passwordForm.value.confirmPassword,
      },
    })) as ApiResponse;

    if (response.statusCode === 200) {
      showModal("success", "Success", "Password has been changed successfully");
      // Reset form
      passwordForm.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
      // Clear errors
      errors.value = {};
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to change password"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to change password"
    );
  } finally {
    isChangingPassword.value = false;
  }
}

async function saveWhatsAppConfig() {
  try {
    loadingStates.value.whatsapp = true;

    // Validate WhatsApp settings
    const whatsappErrors: Errors = {};

    if (!settings.value.wahaEndpoint) {
      whatsappErrors.wahaEndpoint = "WAHA endpoint is required";
    } else if (!isValidUrl(settings.value.wahaEndpoint)) {
      whatsappErrors.wahaEndpoint = "Please enter a valid URL";
    }

    if (!settings.value.adminPhoneNumber) {
      whatsappErrors.adminPhoneNumber = "Admin phone number is required";
    } else if (!isValidPhoneNumber(settings.value.adminPhoneNumber)) {
      whatsappErrors.adminPhoneNumber =
        "Please enter a valid phone number with country code";
    }

    if (Object.keys(whatsappErrors).length > 0) {
      errors.value = { ...errors.value, ...whatsappErrors };
      return;
    }

    const response = (await $apiFetch("/api/setting/update-whatsapp-config", {
      method: "POST",
      body: {
        wahaEndpoint: settings.value.wahaEndpoint,
        adminPhoneNumber: settings.value.adminPhoneNumber,
      },
    })) as ApiResponse;

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "WhatsApp configuration has been updated successfully"
      );
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update WhatsApp configuration"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update WhatsApp configuration"
    );
  } finally {
    loadingStates.value.whatsapp = false;
  }
}

function isValidPhoneNumber(phone: string): boolean {
  // Basic phone number validation with country code without +
  const phoneRegex = /^\d{1,14}$/;
  return phoneRegex.test(phone);
}

async function saveLandingPageSettings() {
  try {
    loadingStates.value.landingPage = true;

    // Validate landing page settings
    const landingPageErrors: Errors = {};

    if (!settings.value.landingPage.title) {
      landingPageErrors.landingPageTitle = "Title is required";
    }

    if (!settings.value.landingPage.description) {
      landingPageErrors.landingPageDescription = "Description is required";
    }

    if (!settings.value.landingPage.button.text) {
      landingPageErrors.landingPageButtonText = "Button text is required";
    }

    if (!settings.value.landingPage.button.redirectUrl) {
      landingPageErrors.landingPageButtonRedirectUrl =
        "Redirect URL is required";
    } else if (!isValidUrl(settings.value.landingPage.button.redirectUrl)) {
      landingPageErrors.landingPageButtonRedirectUrl =
        "Please enter a valid URL";
    }

    if (!settings.value.landingPage.image1) {
      landingPageErrors.landingPageImage1 = "Image 1 is required";
    }

    if (!settings.value.landingPage.image2) {
      landingPageErrors.landingPageImage2 = "Image 2 is required";
    }

    if (!settings.value.landingPage.image3) {
      landingPageErrors.landingPageImage3 = "Image 3 is required";
    }

    if (Object.keys(landingPageErrors).length > 0) {
      errors.value = { ...errors.value, ...landingPageErrors };
      return;
    }

    const response = (await $apiFetch("/api/setting/update-landing-page", {
      method: "POST",
      body: {
        title: settings.value.landingPage.title,
        description: settings.value.landingPage.description,
        buttonText: settings.value.landingPage.button.text,
        redirectUrl: settings.value.landingPage.button.redirectUrl,
        image1: settings.value.landingPage.image1,
        image2: settings.value.landingPage.image2,
        image3: settings.value.landingPage.image3,
      },
    })) as ApiResponse;

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "Landing page settings have been updated successfully"
      );
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update landing page settings"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update landing page settings"
    );
  } finally {
    loadingStates.value.landingPage = false;
  }
}

async function saveTermsAndConditions() {
  try {
    loadingStates.value.terms = true;

    // Validate terms and conditions
    if (!settings.value.termsAndConditions.trim()) {
      errors.value.termsAndConditions =
        "Terms and conditions content is required";
      return;
    }

    const response = (await $apiFetch("/api/setting/update-terms", {
      method: "POST",
      body: {
        content: settings.value.termsAndConditions,
      },
    })) as ApiResponse;

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "Terms and conditions have been updated successfully"
      );
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update terms and conditions"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update terms and conditions"
    );
  } finally {
    loadingStates.value.terms = false;
  }
}

interface GoogleCalendarResponse {
  statusCode: number;
  data?: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken: string;
  };
}

async function fetchGoogleCalendarCredentials() {
  try {
    const response = (await $apiFetch(
      "/api/setting/get-google-calendar-config"
    )) as GoogleCalendarResponse;

    console.log("Calendar response:", response);

    if (response.statusCode === 200 && response.data) {
      settings.value.googleCalendar = {
        clientId: response.data.clientId || "",
        clientSecret: response.data.clientSecret || "",
        redirectUri: response.data.redirectUri || "",
        refreshToken: response.data.refreshToken || "",
      };
    }
  } catch (error) {
    console.error("Failed to fetch Google Calendar credentials:", error);
  }
}

onMounted(async () => {
  await fetchConfig();
  await getHolidays();
  await fetchGoogleCalendarCredentials();
  // Check Google Calendar status
  try {
    const response = (await $apiFetch(
      "/api/auth/google/status"
    )) as GoogleCalendarStatusResponse;
    isGoogleCalendarAuthorized.value = response.isAuthorized;
  } catch (error) {
    console.error("Failed to check Google Calendar status:", error);
  }
});

function handleConnectGoogleCalendar() {
  window.location.href = `${config.public.baseUrl}/api/auth/google/init`;
}

async function saveGoogleCalendarCredentials() {
  try {
    loadingStates.value.googleCalendar = true;

    // Validate Google Calendar settings
    const googleCalendarErrors: Errors = {};

    if (!settings.value.googleCalendar.clientId) {
      googleCalendarErrors.googleCalendarClientId = "Client ID is required";
    }

    if (!settings.value.googleCalendar.clientSecret) {
      googleCalendarErrors.googleCalendarClientSecret =
        "Client Secret is required";
    }

    if (!settings.value.googleCalendar.redirectUri) {
      googleCalendarErrors.googleCalendarRedirectUri =
        "Redirect URI is required";
    } else if (!isValidUrl(settings.value.googleCalendar.redirectUri)) {
      googleCalendarErrors.googleCalendarRedirectUri =
        "Please enter a valid URL";
    }

    if (Object.keys(googleCalendarErrors).length > 0) {
      errors.value = { ...errors.value, ...googleCalendarErrors };
      return;
    }

    const response = (await $apiFetch(
      "/api/setting/update-google-calendar-config",
      {
        method: "POST",
        body: {
          clientId: settings.value.googleCalendar.clientId,
          clientSecret: settings.value.googleCalendar.clientSecret,
          redirectUri: settings.value.googleCalendar.redirectUri,
          refreshToken: settings.value.googleCalendar.refreshToken,
        },
      }
    )) as ApiResponse;

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "Google Calendar credentials have been updated successfully"
      );
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update Google Calendar credentials"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update Google Calendar credentials"
    );
  } finally {
    loadingStates.value.googleCalendar = false;
  }
}

function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
}

const today = new Date().toISOString().split("T")[0];
const involvedMonths = ref<string[]>([]);

interface GoogleCalendarStatusResponse {
  statusCode: number;
  isAuthorized: boolean;
}

interface HolidayResponse {
  statusCode: number;
  data: Array<{
    id: number;
    start_date: string;
    end_date: string;
    description: string;
  }>;
  message?: string;
}

async function getHolidays() {
  const response = (await $apiFetch(
    "/api/setting/get-holidays"
  )) as HolidayResponse;
  console.log("holidays:", response);

  if (response.statusCode === 200 && response.data) {
    settings.value.holidays = response.data.map((holiday) => ({
      id: holiday.id,
      startDate: formatDateToLocal(holiday.start_date),
      endDate: formatDateToLocal(holiday.end_date),
      description: holiday.description,
    }));
  }
}

function formatDateToLocal(dateString: string | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA"); // en-CA locale gives YYYY-MM-DD format
}

function handleDateChange() {
  if (!settings.value.startDate || !settings.value.endDate) return;

  const startDate = new Date(settings.value.startDate);
  const endDate = new Date(settings.value.endDate);
  const months: string[] = [];

  // Create a new date object for iteration
  const currentDate = new Date(startDate);

  // Set to first day of the month to ensure proper month iteration
  currentDate.setDate(1);

  // Create a new date for end comparison that includes the entire end month
  const endCompareDate = new Date(endDate);
  endCompareDate.setDate(1);

  // Loop through each month
  while (currentDate <= endCompareDate) {
    months.push(
      new Date(currentDate).toLocaleString("default", { month: "long" })
    );
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  involvedMonths.value = months;
}

function addHoliday() {
  settings.value.holidays.push({
    id: null,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    description: "",
  });
}

function removeHoliday(index: number) {
  settings.value.holidays.splice(index, 1);
}

function validateHolidayDates() {
  errors.value = {};

  settings.value.holidays.forEach((holiday, index) => {
    if (!holiday.startDate) {
      errors.value[`holiday${index}Start`] = "Start date is required";
    }
    if (!holiday.endDate) {
      errors.value[`holiday${index}End`] = "End date is required";
    }
    if (holiday.startDate && holiday.endDate) {
      const start = new Date(holiday.startDate);
      const end = new Date(holiday.endDate);
      if (end < start) {
        errors.value[`holiday${index}End`] =
          "End date must be after start date";
      }
    }
  });
}

async function saveHolidays() {
  try {
    loadingStates.value.holiday = true;

    // Validate holidays
    if (
      !settings.value.holidays.every(
        (holiday) => holiday.startDate && holiday.endDate
      )
    ) {
      errors.value.holidays = "All holidays must have both start and end dates";
      return;
    }

    const holidaysToSave = settings.value.holidays.map((holiday) => ({
      id: holiday.id || null,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      description: holiday.description,
    }));

    const response = (await $apiFetch("/api/setting/update-holidays", {
      method: "POST",
      body: {
        holidays: holidaysToSave,
      },
    })) as ApiResponse;

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "Holidays have been updated successfully"
      );
      settings.value.holidays = [];
      await getHolidays();
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update holidays"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update holidays"
    );
  } finally {
    loadingStates.value.holiday = false;
  }
}

async function savePaymentConfig() {
  try {
    loadingStates.value.payment = true;

    const response = await $apiFetch("/api/setting/update-payment-config", {
      method: "POST",
      body: {
        chipMode: settings.value.chipMode,
        chipBrandId: settings.value.chipBrandId,
        chipSecretKey: settings.value.chipSecretKey,
        enableChip: settings.value.enableChip,
        enableManual: settings.value.enableManual,
        enableFullPayment: settings.value.enableFullPayment,
        enableDeposit: settings.value.enableDeposit,
        // Join array back to comma-separated string for saving
        activePaymentMethods: settings.value.activePaymentMethods.join(","),
      },
    });

    if (response.statusCode === 200) {
      showModal("success", "Success", "Payment settings updated successfully");
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update payment settings"
    );
  } finally {
    loadingStates.value.payment = false;
  }
}

function toggleEnableManual() {
  settings.value.enableManual = settings.value.enableManual === 1 ? 0 : 1;
}

function toggleEnableFullPayment() {
  settings.value.enableFullPayment =
    settings.value.enableFullPayment === 1 ? 0 : 1;
}

function toggleEnableDeposit() {
  settings.value.enableDeposit = settings.value.enableDeposit === 1 ? 0 : 1;
}

function toggleManual() {
  settings.value.enableManual = settings.value.enableManual === 1 ? 0 : 1;
}

function toggleFullPayment() {
  settings.value.enableFullPayment =
    settings.value.enableFullPayment === 1 ? 0 : 1;
}

function toggleDeposit() {
  settings.value.enableDeposit = settings.value.enableDeposit === 1 ? 0 : 1;
}

function toggleChip() {
  settings.value.enableChip = settings.value.enableChip === 1 ? 0 : 1;
}
</script>

<style lang="scss" scoped>
.tab-btn {
  position: relative;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--color-primary);
    transform: scaleX(0);
    transition: transform 0.2s ease;
    transform-origin: center;
  }

  &:hover::after {
    transform: scaleX(0.5);
  }

  &:focus {
    outline: none;
    &::after {
      transform: scaleX(0.8);
    }
  }

  &.active::after,
  &[aria-selected="true"]::after {
    transform: scaleX(1);
  }
}

.settings-tabs {
  .tab-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

// Enhanced time input styles
input[type="time"] {
  @apply relative bg-white;
  min-width: 140px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;

  // Base styles
  &::-webkit-datetime-edit-fields-wrapper {
    @apply px-0 text-gray-900;
    padding-inline: 0;
  }

  &::-webkit-datetime-edit {
    @apply text-gray-900;
    padding-inline: 0;
  }

  // Custom calendar picker indicator
  &::-webkit-calendar-picker-indicator {
    @apply opacity-50 cursor-pointer w-4 h-4 hover:opacity-100 transition-opacity duration-200;
    margin-right: 0.5rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'%3E%3C/path%3E%3C/svg%3E");
  }

  // Hour field
  &::-webkit-datetime-edit-hour-field {
    @apply px-1 text-gray-900 rounded transition-colors;

    &:focus {
      @apply bg-[var(--color-primary)] bg-opacity-10;
    }
  }

  // Minute field
  &::-webkit-datetime-edit-minute-field {
    @apply px-1 text-gray-900 rounded transition-colors;

    &:focus {
      @apply bg-[var(--color-primary)] bg-opacity-10;
    }
  }

  // Separator styling
  &::-webkit-datetime-edit-text {
    @apply text-gray-400 px-0.5 select-none;
  }

  // States
  &:hover:not(:disabled) {
    @apply border-[var(--color-primary-light)] bg-gray-50 bg-opacity-50;
  }

  &:focus:not(:disabled) {
    @apply outline-none ring-2 ring-[var(--color-primary)] ring-opacity-20 border-[var(--color-primary)] bg-white;
  }

  &:disabled {
    @apply bg-gray-50 cursor-not-allowed;

    &::-webkit-datetime-edit {
      @apply text-gray-500;
    }
  }
}

// Time input wrapper
.time-input-wrapper {
  @apply relative flex items-center;

  .time-icon {
    @apply absolute left-3 text-gray-400 pointer-events-none transition-colors duration-200 z-10;

    &.error {
      @apply text-red-400;
    }
  }

  &:hover .time-icon:not(.error) {
    @apply text-gray-500;
  }

  &:focus-within .time-icon:not(.error) {
    @apply text-[var(--color-primary)];
  }
}

// Error state
.has-error {
  input[type="time"] {
    @apply border-red-300;

    &:focus {
      @apply ring-red-500 ring-opacity-20 border-red-500;
    }

    &::-webkit-datetime-edit {
      @apply text-red-900;
    }

    &::-webkit-datetime-edit-hour-field,
    &::-webkit-datetime-edit-minute-field {
      &:focus {
        @apply bg-red-50;
      }
    }
  }
}

// Error message styling
.error-message {
  font-size: 0.75rem;
  bottom: -1.25rem;
  left: 0;
}

// Shake animation
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

// Input icon styling
.input-icon {
  @apply absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors duration-200;
}

// Remove duplicate transitions
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0 transform translate-y-2;
}

// Form group spacing
.form-group {
  @apply space-y-2;

  &:not(:last-child) {
    @apply mb-6;
  }
}

// Input label styling
.input-label {
  @apply block text-sm font-medium text-[var(--color-text-primary)];
}

// Loading overlay
.loading-overlay {
  backdrop-filter: blur(2px);
}

// Save button container
.save-button-container {
  background: linear-gradient(to top, white, white, transparent);
}

.break-list-enter-active,
.break-list-leave-active {
  transition: all 0.3s ease;
}
.break-list-enter-from,
.break-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.break-list-move {
  transition: transform 0.3s ease;
}

// Add responsive styles
@media (max-width: 640px) {
  .tab-btn {
    padding-left: 0.75rem;
    padding-right: 0.75rem;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  .time-input-wrapper {
    input[type="time"] {
      min-width: 120px;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    }

    .time-icon {
      left: 0.5rem;

      svg {
        width: 1rem;
        height: 1rem;
      }
    }
  }

  .error-message {
    font-size: 0.75rem;
    bottom: -1.25rem;
    left: 0;
  }
}

// Enhance mobile touch targets
@media (max-width: 640px) {
  input[type="time"],
  input[type="number"],
  input[type="password"],
  select,
  button {
    min-height: 2.75rem;
  }

  .break-list-item {
    @apply relative;

    .delete-button {
      @apply absolute -top-2 -right-2 p-2;

      svg {
        @apply w-5 h-5;
      }
    }
  }
}

// Enhance scrolling behavior
.settings-tabs {
  .tab-nav {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

// Add smooth transitions for mobile
.mobile-fade-enter-active,
.mobile-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-fade-enter-from,
.mobile-fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.calendar-icon {
  @apply absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors duration-200;

  svg {
    @apply w-4 h-4 text-gray-400;
  }

  &.error {
    svg {
      @apply text-red-400;
    }
  }
}

input[type="date"] {
  @apply relative bg-white;
  min-width: 140px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    @apply opacity-0 absolute inset-0 w-full h-full cursor-pointer;
  }

  &:hover + .calendar-icon svg {
    @apply text-gray-500;
  }

  &:focus + .calendar-icon svg {
    @apply text-[var(--color-primary)];
  }
}

@media (max-width: 640px) {
  .calendar-icon {
    @apply left-2;

    svg {
      @apply w-4 h-4;
    }
  }

  input[type="date"] {
    @apply text-sm;
    min-width: 120px;
  }
}
</style>
