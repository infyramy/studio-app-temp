<template>
  <div>
    <div
      class="min-h-screen font-sans flex items-center justify-center py-6 sm:py-12"
      :style="{
        background: `white`,
      }"
    >
      <div class="w-full max-w-2xl mx-auto px-4">
        <div class="p-2 mb-3">
          <!-- Logo -->
          <div class="flex justify-start items-center gap-6">
            <template v-if="isLoadingLogo">
              <div class="w-auto h-14 bg-gray-200 rounded animate-pulse"></div>
              <div class="flex flex-col gap-2">
                <div class="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </template>
            <template v-else>
              <img :src="LOGO" alt="Logo" class="w-auto h-14" />
              <div class="flex flex-col">
                <span class="text-lg font-semibold">Studio Raya 2025</span>
                <span class="text-sm text-[var(--color-text-primary)]"
                  >By {{ STUDIO_NAME }}</span
                >
              </div>
            </template>
          </div>
        </div>

        <!-- Main Card -->
        <div
          class="bg-[var(--color-bg-white)] rounded-2xl sm:rounded-[32px] shadow-xl shadow-[var(--color-primary)]/10 overflow-hidden"
        >
          <!-- Header with Steps -->
          <div
            class="relative bg-[var(--color-bg-light)] px-4 sm:px-6 py-4 sm:py-6 border-[var(--color-border-primary)]"
          >
            <div v-if="currentStep === 1">
              <h1
                class="text-2xl font-bold text-[var(--color-text-primary)] mb-2"
              >
                Choose your theme
              </h1>
              <p class="text-md text-[#6b7280]">
                Choose your preferred studio theme
              </p>
            </div>

            <div v-else-if="currentStep === 2">
              <h1
                class="text-2xl font-bold text-[var(--color-text-primary)] mb-2"
              >
                Pick a date & time
              </h1>
              <p class="text-md text-[var(--color-text-muted)]">
                Choose a date and time that suits your Raya photo session
              </p>
            </div>

            <div v-else-if="currentStep === 3">
              <h1
                class="text-2xl font-bold text-[var(--color-text-primary)] mb-2"
              >
                Enhance your session with add-ons
              </h1>
              <p class="text-md text-[var(--color-text-muted)]">
                Add any additional services you want to enhance your session
              </p>
            </div>

            <div v-else-if="currentStep === 4">
              <h1
                class="text-2xl font-bold text-[var(--color-text-primary)] mb-2"
              >
                Customer Details
              </h1>
              <p class="text-md text-[var(--color-text-muted)]">
                Add your personal details
              </p>
            </div>

            <div v-else-if="currentStep === 5">
              <h1
                class="text-2xl font-bold text-[var(--color-text-primary)] mb-2"
              >
                Summary & Payment Details
              </h1>
              <p class="text-md text-[var(--color-text-muted)]">
                Review your booking details and proceed to payment
              </p>
            </div>

            <!-- Mobile Step Indicator -->
            <div class="block sm:hidden my-4">
              <div class="flex items-center justify-start space-x-2">
                <span class="text-sm text-[var(--color-primary)]"
                  >Step {{ currentStep }} of {{ steps.length }}</span
                >
                <span class="text-sm text-[var(--color-text-muted)]"
                  >- {{ steps[currentStep - 1].label }}</span
                >
              </div>
              <!-- Progress bar for mobile -->
              <div
                class="mt-2 h-1 bg-[var(--color-border-primary)] rounded-full"
              >
                <div
                  class="h-1 bg-[var(--color-primary)] rounded-full transition-[var(--transition-all)]"
                  :style="{ width: (currentStep / steps.length) * 100 + '%' }"
                ></div>
              </div>
            </div>

            <!-- Desktop Progress Steps - Hidden on mobile -->
            <div class="hidden sm:block my-4 px-5">
              <div class="max-w-2xl mx-auto">
                <div class="relative flex items-center justify-between">
                  <!-- Progress Line -->
                  <div
                    class="absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2"
                  >
                    <div
                      class="absolute inset-0 bg-[var(--color-border-primary)] rounded-full"
                    ></div>
                    <div
                      class="absolute inset-0 rounded-full bg-[var(--color-primary)] transition-[var(--transition-all)] ease-out"
                      :style="{
                        width:
                          ((currentStep - 1) / (steps.length - 1)) * 100 + '%',
                      }"
                    ></div>
                  </div>

                  <!-- Steps -->
                  <template v-for="(step, index) in steps" :key="step.number">
                    <div class="relative flex flex-col items-center">
                      <button
                        @click="goToStep(step.number)"
                        :disabled="step.number > currentStep + 1"
                        :class="[
                          'relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-[var(--transition-all)]',
                          currentStep >= step.number
                            ? 'bg-[var(--color-primary)] text-[var(--color-text-light)] shadow-lg shadow-[var(--color-primary)]/20'
                            : 'bg-[var(--color-bg-light)] text-[var(--color-text-muted)] border-2 border-[var(--color-border-primary)]',
                          step.number <= currentStep + 1 &&
                            'cursor-pointer hover:scale-105',
                          step.number > currentStep + 1 &&
                            'cursor-not-allowed opacity-60',
                        ]"
                      >
                        <div class="relative flex items-center justify-center">
                          <svg
                            v-if="currentStep > step.number"
                            class="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text-light)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2.5"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span v-else class="text-xs sm:text-sm font-medium">
                            {{ step.number }}
                          </span>
                        </div>
                      </button>
                      <div
                        class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max"
                      >
                        <span
                          class="text-xs whitespace-nowrap font-playfair"
                          :class="
                            currentStep >= step.number
                              ? 'text-[var(--color-primary)]'
                              : 'text-[var(--color-text-muted)]'
                          "
                        >
                          {{ step.label }}
                        </span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <div class="px-4 sm:px-6 pb-4 sm:py-8">
            <div>
              <!-- Step 1: Choose Theme -->
              <div v-show="currentStep === 1" class="space-y-6">
                <div class="max-w-2xl mx-auto">
                  <!-- Session Type Cards -->
                  <div class="space-y-6">
                    <!-- Loading Skeleton -->
                    <template v-if="isLoadingThemes">
                      <div v-for="n in 1" :key="n" class="relative">
                        <div
                          class="relative h-[280px] rounded-2xl overflow-hidden bg-gray-100 animate-pulse"
                        >
                          <div class="absolute inset-0">
                            <div
                              class="w-full h-full bg-gradient-to-t from-gray-200 via-gray-100 to-transparent"
                            ></div>
                          </div>
                          <div
                            class="relative h-full p-6 flex flex-col justify-end"
                          >
                            <div class="mb-2">
                              <div
                                class="h-8 w-48 bg-gray-200 rounded-lg mb-2"
                              ></div>
                              <div
                                class="h-4 w-full bg-gray-200 rounded mb-1"
                              ></div>
                              <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                            <div class="mt-4">
                              <div class="flex items-center justify-between">
                                <div>
                                  <div
                                    class="h-3 w-16 bg-gray-200 rounded mb-1"
                                  ></div>
                                  <div
                                    class="h-6 w-24 bg-gray-200 rounded"
                                  ></div>
                                </div>
                                <div
                                  class="w-24 h-10 bg-gray-200 rounded-xl"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- Actual Theme Cards -->
                    <template v-else>
                      <div
                        v-for="type in sessionTypes"
                        :key="type.value"
                        @click="selectSessionType(type.id)"
                        class="relative group cursor-pointer"
                      >
                        <div
                          class="relative h-[280px] rounded-2xl overflow-hidden transition-all duration-300"
                          :class="[
                            formData.sessionType === type.id
                              ? 'ring-4 ring-[var(--color-text-primary)] ring-offset-2'
                              : 'hover:ring-2 hover:ring-[var(--color-text-primary)]/50 hover:ring-offset-2',
                          ]"
                        >
                          <!-- Background Image -->
                          <div class="absolute inset-0">
                            <img
                              :src="type.image"
                              :alt="type.label"
                              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <!-- Gradient Overlay -->
                            <div
                              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                            ></div>
                          </div>

                          <!-- Content -->
                          <div
                            class="relative h-full p-6 flex flex-col justify-end"
                          >
                            <!-- Theme Label -->
                            <div class="mb-2">
                              <h3
                                class="text-2xl font-semibold text-white font-playfair mb-2"
                              >
                                {{ type.title }}
                              </h3>
                              <p class="text-sm text-white/90 line-clamp-2">
                                {{ type.description }}
                              </p>
                            </div>

                            <!-- Price and Features -->
                            <div class="mt-4">
                              <div class="flex items-center justify-between">
                                <div>
                                  <p class="text-xs text-white/80">Price</p>
                                  <div v-if="type.price_type === 1">
                                    <p class="text-xl font-semibold text-white">
                                      {{ formatPrice(type.price) }}
                                    </p>
                                  </div>
                                  <div v-else-if="type.price_type === 2">
                                    <p class="text-xl font-semibold text-white">
                                      From
                                      {{
                                        formatPrice(
                                          type.pax_prices[0]?.price || 0
                                        )
                                      }}
                                    </p>
                                    <!-- Add price ranges -->
                                    <div class="mt-1 space-y-0.5">
                                      <p
                                        v-for="(
                                          price, index
                                        ) in type.pax_prices"
                                        :key="index"
                                        class="text-xs text-white/80"
                                      >
                                        {{ price.min_pax }}-{{
                                          price.max_pax
                                        }}
                                        pax: {{ formatPrice(price.price) }}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                                  :class="[
                                    formData.sessionType === type.id
                                      ? 'bg-[var(--color-text-primary)] text-white'
                                      : 'bg-white/90 text-[var(--color-text-primary)] group-hover:bg-[var(--color-text-primary)] group-hover:text-white',
                                  ]"
                                >
                                  {{
                                    formData.sessionType === type.id
                                      ? "Selected"
                                      : "Select Theme"
                                  }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Step 2: Session (Select Date & Time) -->
              <div v-show="currentStep === 2" class="space-y-6">
                <div class="max-w-2xl mx-auto">
                  <!-- Update the Month Selector -->
                  <div class="relative mb-8">
                    <select
                      v-model="currentMonth"
                      class="w-full appearance-none bg-[var(--color-bg-white)] border-2 border-[var(--color-border-primary)] hover:border-[var(--color-border-primary)] rounded-2xl px-6 py-4 text-lg font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)]/20 transition-all duration-200 cursor-pointer font-playfair"
                    >
                      <option
                        v-for="(month, index) in months"
                        :key="index"
                        :value="month.index"
                        class="py-3 text-base font-medium"
                      >
                        {{ month.name }} {{ currentYear }}
                      </option>
                    </select>
                    <div
                      class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none flex items-center space-x-2"
                    >
                      <div
                        class="h-5 w-[1px] bg-[var(--color-text-primary)]/10"
                      ></div>
                      <svg
                        class="w-5 h-5 text-[var(--color-text-primary)]/60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  <!-- Calendar Grid -->
                  <div class="relative mb-6">
                    <!-- Shadow Indicators -->
                    <div
                      class="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10"
                    ></div>
                    <div
                      class="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10"
                    ></div>

                    <!-- Navigation Buttons -->
                    <button
                      @click="slideDates('prev')"
                      class="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <svg
                        class="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      @click="slideDates('next')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-gray-50 transition-all duration-200"
                    >
                      <svg
                        class="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    <!-- Scrollable Container -->
                    <div
                      class="overflow-x-auto hide-scrollbar relative"
                      ref="dateScrollContainer"
                    >
                      <div
                        class="grid grid-flow-col gap-2 sm:gap-3 py-2 px-2 auto-cols-[80px] sm:auto-cols-[90px] md:auto-cols-[100px]"
                      >
                        <template v-for="day in calendarDays" :key="day.date">
                          <button
                            @click="day.isSelectable && selectDate(day.date)"
                            :disabled="!day.isSelectable"
                            :data-date="day.date"
                            class="flex-shrink-0 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none relative"
                            :class="[
                              isDateSelected(day.date)
                                ? 'border-[var(--color-text-primary)] bg-white shadow-sm'
                                : day.isSelectable
                                ? 'border-gray-200 bg-white hover:border-gray-300'
                                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50',
                              day.isToday && !isDateSelected(day.date)
                                ? 'border-[var(--color-text-primary)]/50'
                                : '',
                            ]"
                          >
                            <!-- Today Indicator -->
                            <div
                              v-if="day.isToday"
                              class="absolute -top-2 left-1/2 -translate-x-1/2 bg-[var(--color-text-primary)] text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap"
                            >
                              Today
                            </div>
                            <!-- Holiday Indicator -->
                            <div
                              v-if="day.isHoliday"
                              class="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap"
                            >
                              Holiday
                            </div>
                            <!-- Day Name -->
                            <div
                              class="text-xs sm:text-sm font-medium text-gray-600 mb-1"
                            >
                              {{
                                new Date(day.date).toLocaleDateString("en-MY", {
                                  weekday: "short",
                                })
                              }}
                            </div>
                            <!-- Date -->
                            <div
                              class="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2"
                            >
                              {{ new Date(day.date).getDate() }}
                              <!-- Add peak period indicator -->
                              <span
                                v-if="isDateInPeakPeriod(day.date)"
                                class="inline-flex items-center justify-center w-2 h-2 ml-1"
                              >
                                <span class="absolute flex h-2 w-2">
                                  <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
                                  ></span>
                                  <span
                                    class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"
                                  ></span>
                                </span>
                              </span>
                            </div>
                            <!-- Slot Indicator -->
                            <!-- <div
                              class="flex items-center space-x-1 sm:space-x-2"
                            >
                              <div
                                class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                                :class="
                                  getSlotIndicatorColor(getEventCount(day.date))
                                "
                              ></div>
                              <span
                                class="text-xs sm:text-sm text-gray-600 whitespace-nowrap"
                              >
                                {{ getEventCount(day.date) }} slots
                              </span>
                            </div> -->
                          </button>
                        </template>
                      </div>
                    </div>
                  </div>

                  <!-- Add Peak Period Alert -->
                  <div v-if="selectedDatePeakInfo" class="mb-6">
                    <div
                      class="flex items-start space-x-3 p-4 rounded-xl border"
                      :class="[
                        selectedDatePeakInfo.isPositive
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-green-50 border-green-200',
                      ]"
                    >
                      <div class="flex-shrink-0">
                        <svg
                          class="w-5 h-5"
                          :class="[
                            selectedDatePeakInfo.isPositive
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
                      </div>
                      <div>
                        <p
                          class="text-sm font-medium"
                          :class="[
                            selectedDatePeakInfo.isPositive
                              ? 'text-amber-800'
                              : 'text-green-800',
                          ]"
                        >
                          Special Period Pricing
                        </p>
                        <p
                          class="text-sm mt-0.5"
                          :class="[
                            selectedDatePeakInfo.isPositive
                              ? 'text-amber-700'
                              : 'text-green-700',
                          ]"
                        >
                          {{
                            selectedDatePeakInfo.type === "fixed"
                              ? `This date has a ${
                                  selectedDatePeakInfo.isPositive
                                    ? "surcharge"
                                    : "discount"
                                } of ${selectedDatePeakInfo.add_on_price}`
                              : `This date has a ${
                                  selectedDatePeakInfo.add_on_price
                                }% ${
                                  selectedDatePeakInfo.isPositive
                                    ? "surcharge"
                                    : "discount"
                                }`
                          }}. The adjusted pricing is reflected in your total.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div v-if="formData.date">
                    <!-- Session Duration Indicator -->
                    <div class="flex justify-between mb-6">
                      <div class="flex items-center space-x-2">
                        <svg
                          class="w-5 h-5 text-gray-500"
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
                        <span class="text-lg text-gray-600"
                          >{{ slotInterval }} min session</span
                        >
                      </div>
                    </div>

                    <!-- Time Slots -->
                    <div
                      ref="timeSlotsSection"
                      class="grid grid-cols-3 gap-3 scroll-mt-8"
                    >
                      <template v-if="isLoadingTimeSlots">
                        <div
                          v-for="n in 12"
                          :key="n"
                          class="py-4 px-3 rounded-2xl text-center bg-gray-50 border-2 border-gray-100 animate-pulse"
                        >
                          <div
                            class="h-5 bg-gray-200 rounded w-20 mx-auto"
                          ></div>
                        </div>
                      </template>
                      <template v-else-if="availableTimeSlots.length === 0">
                        <div class="col-span-3 py-8 text-center">
                          <div
                            class="flex flex-col items-center justify-center space-y-3"
                          >
                            <svg
                              class="w-12 h-12 text-[var(--color-text-muted)]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1.5"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <h3
                              class="text-lg font-medium text-[var(--color-text-primary)]"
                            >
                              No Time Slots Available
                            </h3>
                            <p
                              class="text-sm text-[var(--color-text-muted)] max-w-sm"
                            >
                              Sorry, all slots for this date are fully booked or
                              already past the current time. Please select
                              another date to continue.
                            </p>
                            <button
                              @click="formData.date = ''"
                              class="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/5 rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors"
                            >
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
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                              Choose Another Date
                            </button>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <button
                          v-for="slot in timeSlots"
                          :key="slot"
                          @click="selectTimeSlot(slot.value)"
                          :disabled="!isTimeSlotAvailable(slot.value)"
                          :class="[
                            'py-4 px-3 rounded-2xl text-center transition-all duration-200 text-base',
                            formData.value.timeSlot === slot.value
                              ? 'bg-white border-2 border-[var(--color-text-primary)] text-[var(--color-text-primary)] font-medium shadow-sm'
                              : isTimeSlotAvailable(slot.value)
                              ? 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
                              : 'bg-gray-50 border-2 border-gray-100 text-gray-400 cursor-not-allowed opacity-50',
                          ]"
                        >
                          {{ slot.slot }}
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Add Ons -->
              <div v-show="currentStep === 3" key="step3" class="space-y-6">
                <div class="max-w-2xl mx-auto">
                  <!-- Add-ons Cards -->
                  <div class="grid grid-cols-1 gap-3">
                    <div
                      v-for="addon in addOns"
                      :key="addon.id"
                      class="relative group"
                      :class="[
                        addon.status == 1
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed opacity-75',
                      ]"
                    >
                      <div
                        class="relative rounded-xl overflow-hidden transition-all duration-300 bg-white border"
                        :class="[
                          hasAddon(addon.id)
                            ? 'border-[var(--color-primary)] bg-opacity-5 bg-[var(--color-primary)]'
                            : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary)]',
                        ]"
                      >
                        <div class="flex items-center p-3">
                          <!-- Image -->
                          <div
                            class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden"
                          >
                            <img
                              :src="addon.image"
                              :alt="addon.label"
                              class="w-full h-full object-cover"
                            />
                          </div>

                          <!-- Content -->
                          <div class="flex-1 ml-3">
                            <div class="flex justify-between items-start">
                              <div>
                                <h3
                                  class="text-base font-medium text-[var(--color-text-primary)]"
                                >
                                  {{ addon.title }}
                                </h3>
                                <p
                                  class="text-sm text-[var(--color-text-muted)] line-clamp-1 mt-0.5"
                                >
                                  {{ formatPrice(addon.price) }} each
                                </p>
                              </div>
                            </div>
                          </div>

                          <!-- Quantity Controls -->
                          <div class="ml-4 flex-shrink-0">
                            <div
                              v-if="addon.status == 1"
                              class="flex items-center space-x-2"
                            >
                              <button
                                @click.stop="decrementAddon(addon.id)"
                                class="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border-primary)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
                                :class="{
                                  'opacity-50 cursor-not-allowed': !hasAddon(
                                    addon.id
                                  ),
                                }"
                                :disabled="!hasAddon(addon.id)"
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
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <span
                                class="w-8 text-center text-[var(--color-text-primary)]"
                              >
                                {{ getAddonQuantity(addon.id) }}
                              </span>
                              <button
                                @click.stop="incrementAddon(addon.id)"
                                class="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--color-border-primary)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
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
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>
                            <span
                              v-else
                              class="text-xs font-medium text-[var(--color-text-muted)]"
                            >
                              Coming soon
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 4: Personal Information -->
              <div v-show="currentStep === 4" key="step4" class="space-y-6">
                <div class="max-w-2xl mx-auto">
                  <!-- Selected theme preview -->
                  <div class="mb-6">
                    <!-- Preview Card -->
                    <div
                      class="bg-white rounded-xl border border-[var(--color-border-primary)] overflow-hidden"
                    >
                      <!-- Theme Image and Details -->
                      <div
                        class="flex items-center p-3 border-b border-[var(--color-border-primary)]"
                      >
                        <div
                          class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          <img
                            :src="selectedTheme?.image"
                            :alt="selectedTheme?.label"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div class="ml-3">
                          <h4
                            class="text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            {{ selectedTheme?.title }}
                          </h4>
                          <p class="text-xs text-[var(--color-text-muted)]">
                            {{ displayNumberOfPax }}
                          </p>
                          <p class="text-xs text-[var(--color-text-muted)]">
                            {{ formatDate(formData.date) }} •
                            {{ formData.timeSlot }}
                          </p>
                          <!-- Add price breakdown for pax-based pricing -->
                          <div
                            v-if="selectedTheme?.price_type === 2"
                            class="mt-1"
                          >
                            <p class="text-xs text-[var(--color-text-muted)]">
                              Base price ({{ formData.numberOfPax }} pax):
                              <span>{{ formatPrice(basePrice) }}</span>
                            </p>
                          </div>
                          <p
                            v-if="selectedDatePeakInfo"
                            class="text-xs text-[var(--color-text-muted)]"
                          >
                            Peak period surcharge ({{
                              selectedDatePeakInfo.add_on_price
                            }}):
                            {{ selectedDatePeakInfo.amount }}
                          </p>
                        </div>
                      </div>

                      <!-- Add-on Details (if selected) -->
                      <div
                        v-if="selectedAddOns.length > 0"
                        v-for="addon in selectedAddOns"
                        :key="addon.id"
                        class="flex items-center p-3 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-light)]"
                      >
                        <div
                          class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                        >
                          <img
                            :src="addon.image"
                            :alt="addon.title"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div class="ml-3 flex-1">
                          <div class="flex justify-between items-center">
                            <h4
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              {{ addon.title }} (x{{
                                getAddonQuantity(addon.id)
                              }})
                            </h4>
                            <p class="text-sm text-[var(--color-text-primary)]">
                              {{
                                formatPrice(
                                  addon.price * getAddonQuantity(addon.id)
                                )
                              }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Booking Details -->
                      <div class="p-3 space-y-2 text-sm">
                        <!-- Date and Time -->
                        <div
                          class="flex items-center text-[var(--color-text-primary)]"
                        >
                          <svg
                            class="w-4 h-4 mr-2 text-[var(--color-text-primary)]/60"
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
                          <span
                            >{{ formatDate(formData.date) }} •
                            {{ formData.timeSlot }}</span
                          >
                        </div>

                        <!-- Number of Persons -->
                        <div
                          class="flex items-center text-[var(--color-text-primary)]"
                        >
                          <svg
                            class="w-4 h-4 mr-2 text-[var(--color-text-primary)]/60"
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
                          <span>{{ displayNumberOfPax }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2
                    class="text-2xl font-bold text-[var(--color-text-primary)] mb-2"
                  >
                    Enter your details
                  </h2>
                  <p class="text-md text-[var(--color-text-muted)] mb-8">
                    Please give your details below.
                  </p>
                  <div class="space-y-4">
                    <!-- Name Input -->
                    <div class="form-group">
                      <input
                        type="text"
                        id="name"
                        v-model="formData.name"
                        class="form-input peer"
                        :class="{ error: errors.name }"
                        placeholder="First Last"
                        required
                        @blur="validateField('name')"
                      />
                      <label for="name" class="form-label">Name</label>
                      <p v-if="errors.name" class="form-error">
                        {{ errors.name }}
                      </p>
                    </div>

                    <!-- Phone Input -->
                    <div class="form-group">
                      <input
                        type="tel"
                        id="phone"
                        v-model="formData.phone"
                        class="form-input peer"
                        :class="{ error: errors.phone }"
                        placeholder="+601234567890"
                        required
                        @blur="validateField('phone')"
                      />
                      <label for="phone" class="form-label">Phone number</label>
                      <p v-if="errors.phone" class="form-error">
                        {{ errors.phone }}
                      </p>
                    </div>

                    <!-- Email Input -->
                    <div class="form-group">
                      <input
                        type="email"
                        id="email"
                        v-model="formData.email"
                        class="form-input peer"
                        :class="{ error: errors.email }"
                        placeholder="example@exmaple.com"
                        required
                        @blur="validateField('email')"
                      />
                      <label for="email" class="form-label">Email</label>
                      <p v-if="errors.email" class="form-error">
                        {{ errors.email }}
                      </p>
                    </div>

                    <!-- Number of Persons Selection -->
                    <div class="form-group">
                      <div
                        class="mb-2 text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Number of persons
                      </div>
                      <div class="flex items-center space-x-3">
                        <button
                          type="button"
                          @click="decrementPax"
                          class="w-12 h-12 flex items-center justify-center rounded-xl border border-[var(--color-border-primary)] text-[var(--color-text-primary)] transition-all duration-200 hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          :disabled="formData.numberOfPax <= 0"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <div class="relative flex-1 max-w-[120px]">
                          <input
                            type="number"
                            id="numberOfPax"
                            v-model.number="formData.numberOfPax"
                            class="form-input text-center h-12 px-3 py-0 text-lg font-medium"
                            :class="{ error: errors.numberOfPax }"
                            min="0"
                            max="20"
                            @blur="validateField('numberOfPax')"
                            @input="handlePaxInput"
                            aria-label="Number of persons"
                          />
                        </div>
                        <button
                          type="button"
                          @click="incrementPax"
                          class="w-12 h-12 flex items-center justify-center rounded-xl border border-[var(--color-border-primary)] text-[var(--color-text-primary)] transition-all duration-200 hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          :disabled="formData.numberOfPax >= 20"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <p v-if="errors.numberOfPax" class="form-error mt-2">
                        {{ errors.numberOfPax }}
                      </p>
                      <p
                        v-if="extraPaxCharge > 0"
                        class="mt-2 text-xs text-[var(--color-text-muted)]"
                      >
                        Additional charge of
                        {{ formatPrice(extraPaxCharge) }} for
                        {{ formData.numberOfPax - MAX_FREE_PAX }}
                        extra person(s)
                      </p>
                    </div>

                    <!-- Where did you find us? Dropdown -->
                    <div class="form-group">
                      <select
                        id="source"
                        v-model="formData.source"
                        class="form-input peer"
                        :class="{ error: errors.source }"
                        required
                        @blur="validateField('source')"
                      >
                        <option value="" disabled selected>
                          Select an option
                        </option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="search">Online Search</option>
                        <option value="family_friends">Family & Friends</option>
                      </select>
                      <label for="source" class="form-label"
                        >Where did you find us?</label
                      >
                      <p v-if="errors.source" class="form-error">
                        {{ errors.source }}
                      </p>
                    </div>

                    <!-- Terms & Conditions -->
                    <div class="pt-2">
                      <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                          <div class="custom-checkbox">
                            <input
                              id="terms"
                              type="checkbox"
                              v-model="formData.termsAccepted"
                              class="hidden"
                              required
                              @blur="validateField('terms')"
                            />
                            <label
                              for="terms"
                              class="checkbox-label"
                              :class="{ 'checkbox-error': errors.terms }"
                            >
                              <svg class="checkbox-icon" viewBox="0 0 24 24">
                                <path
                                  d="M5 13l4 4L19 7"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="3"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </label>
                          </div>
                        </div>
                        <div class="text-sm">
                          <label
                            for="terms"
                            class="text-[var(--color-text-primary)] font-playfair"
                          >
                            I agree to the
                            <button
                              type="button"
                              @click="showTerms = true"
                              class="text-[var(--color-text-primary)] hover:text-[var(--color-primary-light)] transition-colors font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded"
                            >
                              Terms and Conditions
                            </button>
                          </label>
                          <p
                            v-if="errors.terms"
                            class="text-xs text-red-500 mt-1"
                          >
                            {{ errors.terms }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 5: Payment -->
              <div v-show="currentStep === 5" key="step5" class="space-y-6">
                <div class="max-w-2xl mx-auto">
                  <!-- Booking Summary Card -->
                  <div
                    class="bg-white rounded-xl border border-[var(--color-border-primary)] overflow-hidden mb-6"
                  >
                    <!-- Theme Details -->
                    <div
                      class="flex items-center p-3 border-b border-[var(--color-border-primary)]"
                    >
                      <div
                        class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <img
                          :src="selectedTheme?.image"
                          :alt="selectedTheme?.label"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div class="ml-3">
                        <h4
                          class="text-sm font-medium text-[var(--color-text-primary)]"
                        >
                          {{ selectedTheme?.title }}
                        </h4>
                        <p class="text-xs text-[var(--color-text-muted)]">
                          {{ displayNumberOfPax }}
                        </p>
                        <p class="text-xs text-[var(--color-text-muted)]">
                          {{ formatDate(formData.date) }} •
                          {{ formData.timeSlot }}
                        </p>
                        <!-- Add price breakdown for pax-based pricing -->
                        <div
                          v-if="selectedTheme?.price_type === 2"
                          class="mt-1"
                        >
                          <p class="text-xs text-[var(--color-text-muted)]">
                            Base price ({{ formData.numberOfPax }} pax):
                            <span>{{ formatPrice(basePrice) }}</span>
                          </p>
                          <p
                            v-if="selectedDatePeakInfo"
                            class="text-xs text-[var(--color-text-muted)]"
                          >
                            Peak period surcharge ({{
                              selectedDatePeakInfo.amount
                            }}%):
                            {{ selectedDatePeakInfo.amount }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Add-on Details (if selected) -->
                    <div
                      v-if="selectedAddOns.length > 0"
                      v-for="addon in selectedAddOns"
                      class="flex items-center p-3 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-light)]"
                    >
                      <div
                        class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                      >
                        <img
                          :src="addon.image"
                          :alt="addon.label"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div class="ml-3 flex-1">
                        <div
                          :key="addon.id"
                          class="flex justify-between items-center"
                        >
                          <h4
                            class="text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            {{ addon.title }} (x{{
                              getAddonQuantity(addon.id)
                            }})
                          </h4>
                          <p class="text-sm text-[var(--color-text-primary)]">
                            {{
                              formatPrice(
                                addon.price * getAddonQuantity(addon.id)
                              )
                            }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Price Breakdown -->
                    <div class="p-3 space-y-2 text-sm">
                      <!-- Base Price -->
                      <div
                        class="flex justify-between text-[var(--color-text-muted)]"
                      >
                        <span class="flex items-center">
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
                            v-if="selectedTheme?.price_type === 2"
                            class="ml-1 text-xs"
                          >
                            ({{ formData.numberOfPax }} pax)
                          </span>
                        </span>
                        <span>{{ formatPrice(basePrice) }}</span>
                      </div>

                      <!-- Peak Period Adjustment -->
                      <div
                        v-if="selectedDatePeakInfo"
                        class="flex justify-between text-sm"
                      >
                        <span
                          class="text-[var(--color-text-muted)] flex items-center"
                        >
                          <svg
                            class="w-4 h-4 mr-1.5"
                            :class="[
                              selectedDatePeakInfo.isPositive
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
                            selectedDatePeakInfo.isPositive
                              ? "Peak Period Surcharge"
                              : "Special Period Discount"
                          }}
                          <span class="ml-1 text-xs">
                            ({{ selectedDatePeakInfo.add_on_price }})
                          </span>
                        </span>
                        <span
                          :class="[
                            selectedDatePeakInfo.isPositive
                              ? 'text-amber-600'
                              : 'text-green-600',
                          ]"
                        >
                          {{ selectedDatePeakInfo.amount }}
                        </span>
                      </div>

                      <!-- Add-ons -->
                      <template v-if="selectedAddOns.length > 0">
                        <div
                          class="flex justify-between text-[var(--color-text-muted)]"
                        >
                          <span class="flex items-center">
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
                            Add-ons
                          </span>
                          <span>{{ formatPrice(totalAddOnsAmount) }}</span>
                        </div>
                        <!-- Individual Add-ons -->
                        <div
                          v-for="addon in selectedAddOns"
                          :key="addon.id"
                          class="flex justify-between text-xs text-[var(--color-text-muted)] pl-6"
                        >
                          <span
                            >{{ addon.title }} (x{{
                              getAddonQuantity(addon.id)
                            }})</span
                          >
                          <span>{{
                            formatPrice(
                              addon.price * getAddonQuantity(addon.id)
                            )
                          }}</span>
                        </div>
                      </template>

                      <!-- Extra Pax Charge -->
                      <div
                        v-if="extraPaxCharge > 0"
                        class="flex justify-between text-[var(--color-text-muted)]"
                      >
                        <span class="flex items-center">
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
                          Extra Person Charge
                          <span class="ml-1 text-xs">
                            ({{ formData.numberOfPax - MAX_FREE_PAX }} ×
                            {{ formatPrice(EXTRA_PAX_CHARGE) }})
                          </span>
                        </span>
                        <span>{{ formatPrice(extraPaxCharge) }}</span>
                      </div>

                      <!-- Subtotal -->
                      <div
                        v-if="hasAnyAdjustments"
                        class="flex justify-between text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-primary)]"
                      >
                        <span>Subtotal</span>
                        <span>{{
                          formatPrice(subtotalBeforeAdjustments)
                        }}</span>
                      </div>

                      <!-- Total Amount -->
                      <div
                        class="flex justify-between font-medium text-[var(--color-text-primary)] pt-2 border-t border-[var(--color-border-primary)]"
                      >
                        <span>Total Amount</span>
                        <span>{{ formatPrice(totalAmount) }}</span>
                      </div>

                      <!-- Payment Details -->
                      <div class="pt-2 space-y-2">
                        <!-- Amount to Pay -->
                        <div
                          class="flex justify-between font-medium text-[var(--color-text-primary)]"
                        >
                          <span class="flex items-center">
                            <svg
                              class="w-4 h-4 mr-1.5 text-[var(--color-text-primary)]"
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
                            {{
                              formData.paymentType === "deposit"
                                ? "Deposit Required"
                                : "Full Payment"
                            }}
                          </span>
                          <span>{{
                            formData.paymentType === "deposit"
                              ? depositAmount
                              : formatPrice(totalAmount)
                          }}</span>
                        </div>

                        <!-- Balance Due -->
                        <div
                          v-if="formData.paymentType === 'deposit'"
                          class="flex justify-between text-[var(--color-text-muted)]"
                        >
                          <span>Balance Due</span>
                          <span>{{ balanceAmount }}</span>
                        </div>
                      </div>

                      <!-- Payment Note -->
                      <p
                        v-if="formData.paymentType === 'deposit'"
                        class="text-xs text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-primary)]"
                      >
                        Balance payment of {{ balanceAmount }} will be collected
                        on the session day
                      </p>
                    </div>
                  </div>

                  <!-- Payment Method -->
                  <div class="space-y-4">
                    <!-- Payment Amount Selection -->
                    <div class="mb-6">
                      <h3
                        class="text-base font-medium text-[var(--color-text-primary)] font-playfair mb-4"
                      >
                        Select Payment Amount
                      </h3>
                      <div class="flex flex-wrap gap-3">
                        <button
                          v-if="enable_deposit_payment"
                          @click="formData.paymentType = 'deposit'"
                          class="flex-1 relative p-4 border rounded-xl text-left transition-all duration-200"
                          :class="[
                            formData.paymentType === 'deposit'
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                              : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary)]/50',
                          ]"
                        >
                          <div class="flex justify-between items-start mb-1">
                            <span
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              Deposit
                            </span>
                            <div
                              class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                              :class="[
                                formData.paymentType === 'deposit'
                                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                                  : 'border-[var(--color-border-primary)]',
                              ]"
                            >
                              <div
                                v-if="formData.paymentType === 'deposit'"
                                class="w-1.5 h-1.5 rounded-full bg-white"
                              ></div>
                            </div>
                          </div>
                          <p
                            class="text-lg font-semibold text-[var(--color-text-primary)]"
                          >
                            {{ depositAmount }}
                          </p>
                          <p
                            class="text-xs text-[var(--color-text-muted)] mt-1"
                          >
                            Balance of {{ balanceAmount }} to be paid a day
                            before the session
                          </p>
                        </button>

                        <button
                          v-if="enable_full_payment"
                          @click="formData.paymentType = 'full'"
                          class="flex-1 relative p-4 border rounded-xl text-left transition-all duration-200"
                          :class="[
                            formData.paymentType === 'full'
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                              : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary)]/50',
                          ]"
                        >
                          <div class="flex justify-between items-start mb-1">
                            <span
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              Full Payment
                            </span>
                            <div
                              class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                              :class="[
                                formData.paymentType === 'full'
                                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                                  : 'border-[var(--color-border-primary)]',
                              ]"
                            >
                              <div
                                v-if="formData.paymentType === 'full'"
                                class="w-1.5 h-1.5 rounded-full bg-white"
                              ></div>
                            </div>
                          </div>
                          <p
                            class="text-lg font-semibold text-[var(--color-text-primary)]"
                          >
                            {{ formatPrice(totalAmount) }}
                          </p>
                          <p
                            class="text-xs text-[var(--color-text-muted)] mt-1"
                          >
                            Save time and focus on your beautiful moments
                          </p>
                        </button>
                      </div>
                    </div>

                    <!-- Payment Method Selection -->
                    <div class="mb-6">
                      <h3
                        class="text-base font-medium text-[var(--color-text-primary)] font-playfair mb-4"
                      >
                        Select Payment Method
                      </h3>
                      <div class="flex flex-wrap gap-3">
                        <!-- CHIP Payment Option -->
                        <button
                          v-if="enable_chip"
                          @click="formData.paymentMethod = 'chip'"
                          class="flex-1 relative p-4 border rounded-xl text-left transition-all duration-200"
                          :class="[
                            formData.paymentMethod === 'chip'
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                              : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary)]/50',
                          ]"
                        >
                          <div class="flex justify-between items-start mb-1">
                            <span
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              Online Payment
                            </span>
                            <div
                              class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                              :class="[
                                formData.paymentMethod === 'chip'
                                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                                  : 'border-[var(--color-border-primary)]',
                              ]"
                            >
                              <div
                                v-if="formData.paymentMethod === 'chip'"
                                class="w-1.5 h-1.5 rounded-full bg-white"
                              ></div>
                            </div>
                          </div>
                          <div class="flex items-center mt-2">
                            <img
                              src="https://www.chip-in.asia/images/Chip-logo.svg"
                              alt="CHIP"
                              class="h-5"
                            />
                          </div>
                          <p
                            class="text-xs text-[var(--color-text-muted)] mt-2"
                          >
                            Secure online payment via CHIP
                          </p>
                        </button>

                        <!-- Manual Payment Option -->
                        <button
                          v-if="enable_manual"
                          @click="formData.paymentMethod = 'manual'"
                          class="flex-1 relative p-4 border rounded-xl text-left transition-all duration-200"
                          :class="[
                            formData.paymentMethod === 'manual'
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                              : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary)]/50',
                          ]"
                        >
                          <div class="flex justify-between items-start mb-1">
                            <span
                              class="text-sm font-medium text-[var(--color-text-primary)]"
                            >
                              Manual Payment
                            </span>
                            <div
                              class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                              :class="[
                                formData.paymentMethod === 'manual'
                                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                                  : 'border-[var(--color-border-primary)]',
                              ]"
                            >
                              <div
                                v-if="formData.paymentMethod === 'manual'"
                                class="w-1.5 h-1.5 rounded-full bg-white"
                              ></div>
                            </div>
                          </div>
                          <div class="flex items-center mt-2 space-x-2">
                            <svg
                              class="w-5 h-5 text-[var(--color-text-primary)]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <span
                              class="text-sm text-[var(--color-text-primary)]"
                              >WhatsApp QR Payment</span
                            >
                          </div>
                          <p
                            class="text-xs text-[var(--color-text-muted)] mt-2"
                          >
                            QR code will be appear in the invoice
                          </p>
                        </button>
                      </div>
                    </div>

                    <!-- Manual Payment Info -->
                    <div
                      v-if="formData.paymentMethod === 'manual'"
                      class="bg-white border border-[var(--color-border-primary)] rounded-xl p-4"
                    >
                      <div class="flex items-start space-x-3">
                        <svg
                          class="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5"
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
                        <div>
                          <p class="text-sm text-[var(--color-text-muted)]">
                            After submitting your booking:
                          </p>
                          <ol
                            class="mt-2 space-y-2 text-sm text-[var(--color-text-muted)]"
                          >
                            <li class="flex items-start">
                              <span class="mr-2">1.</span>
                              <span
                                >Our admin will contact you via WhatsApp within
                                24 hours</span
                              >
                            </li>
                            <li class="flex items-start">
                              <span class="mr-2">2.</span>
                              <span>You'll receive a QR code for payment</span>
                            </li>
                            <li class="flex items-start">
                              <span class="mr-2">3.</span>
                              <span
                                >Your booking will be confirmed once payment is
                                received</span
                              >
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Footer -->
          <div
            class="px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center"
            :style="{
              background: `var(--color-bg-primary)`,
            }"
          >
            <button
              v-if="currentStep > 1"
              @click="previousStep"
              class="btn btn-secondary text-sm"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <NuxtLink v-else to="/" class="btn btn-secondary text-sm">
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
              Home
            </NuxtLink>

            <button
              v-if="currentStep < 5"
              @click="nextStep"
              class="btn btn-primary text-sm"
            >
              Continue
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              v-else
              @click="processPayment"
              :disabled="isProcessing"
              class="btn btn-primary text-sm"
            >
              <span v-if="isProcessing" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Processing...
              </span>
              <span v-else>Complete Booking</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms and Conditions Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showTerms"
          class="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <!-- Background overlay -->
          <div
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          ></div>

          <div class="flex min-h-screen items-center justify-center p-4">
            <!-- Modal panel -->
            <div
              class="relative transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all w-full max-w-lg"
            >
              <!-- Header -->
              <div
                class="border-b border-[var(--color-border-primary)] px-4 sm:px-6 py-4 flex items-center justify-between"
              >
                <h3
                  class="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]"
                  id="modal-title"
                >
                  Terms and Conditions
                </h3>
                <button
                  @click="showTerms = false"
                  class="text-[var(--color-text-primary)]/60 hover:text-[var(--color-text-primary)] transition-colors p-2"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Content -->
              <div class="px-4 sm:px-6 py-4 max-h-[60vh] overflow-y-auto">
                <div class="space-y-6 prose prose-sm max-w-none">
                  <template v-if="formattedTNC">
                    <VueMarkdown :source="formattedTNC" />
                  </template>
                  <div v-else class="text-center text-gray-500">
                    No terms and conditions available.
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div
                class="border-t border-[var(--color-border-primary)] px-4 sm:px-6 py-4 flex justify-end"
              >
                <button
                  @click="showTerms = false"
                  class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors active:scale-95"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { format } from "date-fns";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import VueMarkdown from "vue-markdown-render";

const route = useRoute();

dayjs.extend(timezone);
dayjs.extend(utc);

// Define page meta to use empty layout
definePageMeta({
  layout: "empty",
  head: {
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
      },
    ],
    meta: [
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
      },
    ],
  },
});

const referral = ref(route.query.ref);
console.log("Referral:", referral.value);

// Add ref for html2pdf instance
const html2pdf = ref(null);

// Enhanced steps configuration
const steps = [
  {
    number: 1,
    label: "Choose Theme",
    description: "Select your preferred photography theme",
  },
  {
    number: 2,
    label: "Session",
    description: "Select date and time for your session",
  },
  {
    number: 3,
    label: "Add Ons",
    description: "Enhance your session with add-ons",
  },
  {
    number: 4,
    label: "Your Details",
    description: "Basic information needed for booking",
  },
  {
    number: 5,
    label: "Payment",
    description: "Secure payment to confirm booking",
  },
];

// Session types configuration
const sessionTypes = ref([]);
const TNC = ref("");
const LOGO = ref("");
const STUDIO_NAME = ref("");

const enable_chip = ref(false);
const enable_manual = ref(false);
const enable_full_payment = ref(false);
const enable_deposit_payment = ref(false);

// Add isLoadingLogo ref after other refs
const isLoadingLogo = ref(true);

async function getConfig() {
  isLoadingLogo.value = true;
  try {
    const config = await $fetch("/api/booking/get-config");

    EXTRA_PAX_CHARGE.value = parseInt(config.charge_per_pax);
    MAX_FREE_PAX.value = parseInt(config.max_free_pax);
    MAX_PAX.value = parseInt(config.max_pax);
    LOGO.value = config.logo;

    enable_chip.value = config.enable_chip == 1 ? true : false;
    enable_manual.value = config.enable_manual == 1 ? true : false;

    if (enable_chip.value) {
      formData.value.paymentMethod = "chip";
    } else if (!enable_chip.value && enable_manual.value) {
      formData.value.paymentMethod = "manual";
    }

    enable_full_payment.value = config.enable_full_payment == 1 ? true : false;
    enable_deposit_payment.value =
      config.enable_deposit_payment == 1 ? true : false;

    if (enable_full_payment.value) {
      formData.value.paymentType = "full";
    } else if (!enable_full_payment.value && enable_deposit_payment.value) {
      formData.value.paymentType = "deposit";
    }

    // Handle TNC content
    if (config.tnc !== undefined && config.tnc !== null) {
      const sanitizedContent = String(config.tnc).trim();
      // console.log("Sanitized TNC:", sanitizedContent); // Debug sanitized content
      TNC.value = sanitizedContent;
    } else {
      console.log("No TNC content found");
      TNC.value = "";
    }
  } catch (error) {
    console.error("Failed to fetch config:", error);
    TNC.value = "";
  } finally {
    isLoadingLogo.value = false;
  }
}

async function getStudioName() {
  const response = await $fetch("/api/setting/get-organization");
  console.log("Response studio name: ", response);

  STUDIO_NAME.value = response.data.companyName;
}

// Add after other refs
const isLoadingThemes = ref(true);

// Update the getThemes function
const getThemes = async () => {
  isLoadingThemes.value = true;
  try {
    const themes = await $fetch("/api/booking/get-themes");
    sessionTypes.value = themes;
  } catch (error) {
    console.error("Failed to fetch themes:", error);
    sessionTypes.value = [];
  } finally {
    isLoadingThemes.value = false;
  }
};

const getAddons = async () => {
  try {
    const addonsData = await $fetch("/api/booking/get-addons");
    addOns.value = addonsData;
  } catch (error) {
    console.error("Failed to fetch addons:", error);
    addOns.value = [];
  }
};

// Add after sessionTypes array
const addOns = ref([]);

// Form state
const currentStep = ref(1);
const isProcessing = ref(false);
const formData = ref({
  name: "",
  email: "",
  phone: "",
  source: "",
  termsAccepted: false,
  date: "",
  timeSlot: "",
  sessionType: "",
  numberOfPax: 0,
  addOns: [],
  paymentType: "deposit",
  paymentMethod: "chip", // Add default payment method
  value: {
    timeSlot: "",
  },
});

const errors = ref({});

// First declare all the refs
const currentDate = ref(new Date()); // Initialize with current date
const forceRefresh = ref(0); // Add this to force calendar refresh
const selectedDate = ref(null);
const dateScrollContainer = ref(null);
const initialScrollComplete = ref(false);
const timeSlotsSection = ref(null);

// Update months array to use correct indices
const months = computed(() => {
  if (!dateRange.value.startDate || !dateRange.value.endDate) return [];

  const startDate = new Date(dateRange.value.startDate);
  const endDate = new Date(dateRange.value.endDate);
  const monthsArray = [];

  // Create a new date object for iteration
  let current = new Date(startDate);
  current.setDate(1); // Set to first day of month to ensure proper month iteration

  // Create a new date for end comparison that includes the entire end month
  const endCompareDate = new Date(endDate);
  endCompareDate.setMonth(endCompareDate.getMonth() + 1, 0); // Set to last day of end month

  while (current <= endCompareDate) {
    monthsArray.push({
      name: current.toLocaleString("default", { month: "long" }),
      index: current.getMonth(),
      year: current.getFullYear(),
    });

    // Move to first day of next month
    current.setMonth(current.getMonth() + 1);
  }

  return monthsArray;
});

// Update currentMonth computed to handle year changes
const currentMonth = computed({
  get: () => {
    return currentDate.value.getMonth();
  },
  set: async (monthIndex) => {
    if (!dateRange.value.startDate || !dateRange.value.endDate) return;

    // Find the month object from our months array
    const monthObj = months.value.find((m) => m.index === monthIndex);
    if (!monthObj) return;

    // Create a new date with the selected month and year
    currentDate.value = new Date(monthObj.year, monthIndex, 1);

    // Force a calendar refresh
    forceRefresh.value++;

    // Month parameter should be 1-based for the API
    // await fetchSlotsData(monthIndex + 1);

    // Reset form data date when changing months
    formData.value.date = "";
    formData.value.timeSlot = "";
    formData.value.value.timeSlot = "";

    nextTick(() => {
      const firstValidDate = calendarDays.value[0]?.date;
      if (firstValidDate) {
        scrollToDate(firstValidDate);
      }
    });
  },
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const holidays = ref([]);

async function getHolidays() {
  const response = await $fetch("/api/setting/get-holidays");
  console.log("holidays:", response);
  holidays.value = response.data;
}

// Update calendarDays computed to allow weekend selection
const calendarDays = computed(() => {
  // Add forceRefresh to dependencies
  forceRefresh.value;

  if (!dateRange.value.startDate || !dateRange.value.endDate) return [];

  const startDate = new Date(dateRange.value.startDate);
  const endDate = new Date(dateRange.value.endDate);

  const month = currentDate.value.getMonth();
  const year = currentDate.value.getFullYear();

  // Get today's date in Malaysia timezone
  const malaysiaToday = convertToMYTime(new Date());
  malaysiaToday.setHours(0, 0, 0, 0);

  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Create dates for comparison with consistent time values
  const compareStartDate = new Date(startDate);
  compareStartDate.setHours(0, 0, 0, 0);
  const compareEndDate = new Date(endDate);
  compareEndDate.setHours(23, 59, 59, 999);
  const compareFirstDay = new Date(firstDay);
  compareFirstDay.setHours(0, 0, 0, 0);
  const compareLastDay = new Date(lastDay);
  compareLastDay.setHours(23, 59, 59, 999);

  // Ensure firstDay and lastDay are within the date range
  const effectiveStartDate = new Date(
    Math.max(compareFirstDay.getTime(), compareStartDate.getTime())
  );
  const effectiveEndDate = new Date(
    Math.min(compareLastDay.getTime(), compareEndDate.getTime())
  );

  let date = new Date(effectiveStartDate);
  while (date <= effectiveEndDate) {
    const malaysiaDate = convertToMYTime(date);
    malaysiaDate.setHours(0, 0, 0, 0);

    const dateStr = format(date, "yyyy-MM-dd");

    // Check if the date falls within any holiday period
    const isHoliday = holidays.value.some((holiday) => {
      const holidayStart = new Date(holiday.start_date);
      const holidayEnd = new Date(holiday.end_date);
      holidayStart.setHours(0, 0, 0, 0);
      holidayEnd.setHours(23, 59, 59, 999);
      return malaysiaDate >= holidayStart && malaysiaDate <= holidayEnd;
    });

    // Check if the date is selectable (not a holiday and not in the past)
    const isSelectable =
      malaysiaDate >= malaysiaToday && // Today or future date
      !isHoliday; // Not a holiday

    const isToday =
      malaysiaDate.getDate() === malaysiaToday.getDate() &&
      malaysiaDate.getMonth() === malaysiaToday.getMonth() &&
      malaysiaDate.getFullYear() === malaysiaToday.getFullYear();

    // Add all dates, but mark them as selectable based on our conditions
    days.push({
      date: dateStr,
      isSelectable: isSelectable, // Remove the isToday override to respect holiday status
      isToday,
      isHoliday,
    });

    // Move to next day
    date = new Date(date.setDate(date.getDate() + 1));
  }
  return days;
});

// Add new ref for slots data
const slotsData = ref({});

// Add function to fetch slots data
async function fetchSlotsData(month) {
  try {
    const response = await $fetch("/api/booking/get-slots", {
      params: {
        month: month,
        year: currentYear.value,
        theme_id: formData.value.sessionType,
      },
    });
    console.log("Response slots data: ", response);
    if (response.status === "success") {
      slotsData.value = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch slots data:", error);
  }
}

// Update getEventCount to use the API data
function getEventCount(date) {
  return slotsData.value[date] || 0;
}

function getSlotIndicatorColor(slots) {
  if (slots === 0) return "bg-gray-300";
  if (slots <= 2) return "bg-yellow-400";
  if (slots <= 4) return "bg-yellow-400";
  return "bg-green-400";
}

// Add ref for available time slots
const availableTimeSlots = ref([]);

// Update the timeSlots to be computed based on availableTimeSlots
const timeSlots = computed(() => {
  if (availableTimeSlots.value.length > 0) {
    return availableTimeSlots.value;
  }
  return [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
  ];
});

// Add after other refs
const isLoadingTimeSlots = ref(false);

const slotInterval = ref(0);
const restTime = ref(0);

// Add these refs for date range
const dateRange = ref({
  startDate: "",
  endDate: "",
});

// Add function to fetch date range from settings
async function fetchDateRange() {
  try {
    const response = await $fetch("/api/booking/get-date-range");
    // console.log("Response date range: ", response);

    dateRange.value = {
      startDate: formatDateToLocal(response.start_date),
      endDate: formatDateToLocal(response.end_date),
    };

    // console.log("Date range: ", dateRange.value);
  } catch (error) {
    console.error("Error fetching date range:", error);
  }
}

function formatDateToLocal(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA"); // en-CA locale gives YYYY-MM-DD format
}

// Update the isDateDisabled function to include date range validation
const isDateDisabled = (date) => {
  // Convert all dates to Malaysia timezone for consistent comparison
  const currentDate = dayjs(date).tz("Asia/Kuala_Lumpur").startOf("day");
  const today = dayjs().tz("Asia/Kuala_Lumpur").startOf("day");

  const startDate = dateRange.value.startDate
    ? dayjs(dateRange.value.startDate).tz("Asia/Kuala_Lumpur").startOf("day")
    : null;
  const endDate = dateRange.value.endDate
    ? dayjs(dateRange.value.endDate).tz("Asia/Kuala_Lumpur").startOf("day")
    : null;

  // Disable dates outside the configured range
  if (startDate && currentDate.isBefore(startDate)) {
    return true;
  }
  if (endDate && currentDate.isAfter(endDate)) {
    return true;
  }

  // Disable past dates
  return currentDate.isBefore(today);
};

// Update selectDate function to include range validation
const selectDate = async (date) => {
  // console.log("Selected date: ", date);
  // Check if date is within range
  if (isDateDisabled(date)) {
    return;
  }

  formData.value.date = date;
  formData.value.timeSlot = ""; // Clear time slot when date changes
  formData.value.value.timeSlot = ""; // Clear the nested timeSlot as well
  validateField("date");

  isLoadingTimeSlots.value = true;

  try {
    // Fetch available slots for the selected date and theme
    const response = await $fetch("/api/booking/get-available-slots", {
      params: {
        date: date,
        theme_id: formData.value.sessionType,
      },
    });

    // console.log("Response available slots: ", response);

    if (response.status === "success") {
      slotInterval.value = response.interval;
      restTime.value = response.rest;

      // Filter out past time slots if the selected date is today
      if (isToday(date)) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        availableTimeSlots.value = response.data.filter((slot) => {
          const [time, period] = slot.slot.split(" ");
          let [hours, minutes] = time.split(":").map(Number);

          // Convert to 24-hour format
          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;

          // Compare with current time
          return (
            hours > currentHour ||
            (hours === currentHour && minutes > currentMinute)
          );
        });
      } else {
        availableTimeSlots.value = response.data;
      }
    } else {
      availableTimeSlots.value = [];
      console.error("Failed to fetch available slots:", response.message);
    }
  } catch (error) {
    availableTimeSlots.value = [];
    console.error("Error fetching available slots:", error);
  } finally {
    isLoadingTimeSlots.value = false;
  }

  await nextTick();
  if (timeSlotsSection.value) {
    timeSlotsSection.value.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

// Add helper function to check if a date is today
const isToday = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Update onMounted to set initial month based on date range
onMounted(async () => {
  try {
    // Load all data in parallel
    await Promise.all([
      getConfig(),
      getThemes(),
      getAddons(),
      fetchDateRange(),
      getHolidays(),
      getStudioName(),
    ]);

    if (dateRange.value.startDate) {
      const today = new Date();
      const startDate = new Date(dateRange.value.startDate);
      const endDate = new Date(dateRange.value.endDate);

      // Set initial date to current month if it's within range, otherwise use start date
      if (today >= startDate && today <= endDate) {
        currentDate.value = today;
      } else {
        currentDate.value = startDate;
      }

      // Wait for next tick before trying to scroll
      nextTick(() => {
        const firstValidDate = calendarDays.value[0]?.date;
        if (firstValidDate) {
          scrollToDate(firstValidDate);
        }
      });
    }

    // Load html2pdf dynamically
    try {
      import("html2pdf.js").then((module) => {
        html2pdf.value = module.default;
      });
    } catch (error) {
      console.error("Failed to load html2pdf:", error);
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

// Update the time slots display section
const isTimeSlotAvailable = computed(() => {
  return (slot) => {
    if (availableTimeSlots.value.length === 0) return true;
    return availableTimeSlots.value.some((s) => s.value === slot);
  };
});

const isDateSelected = (date) => {
  return formData.value.date === date;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Session selection
const selectSessionType = (type) => {
  formData.value.sessionType = type;
  validateField("sessionType");

  // Reset date and time when theme changes
  formData.value.date = "";
  formData.value.timeSlot = "";
  formData.value.value.timeSlot = "";

  // Fetch slots for the new theme
  // fetchSlotsData(currentMonth.value + 1);
};

const selectTimeSlot = (slot) => {
  formData.value.timeSlot = slot;
  formData.value.value.timeSlot = slot;
  validateField("timeSlot");
};

// Computed session price based on type
const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

// Add these helper functions before the computed properties
const getPaxBasedPrice = (theme, numberOfPax) => {
  if (!theme?.pax_prices || theme.pax_prices.length === 0) return 0;

  // Sort pax_prices by min_pax to ensure we get the correct range
  const sortedPrices = [...theme.pax_prices].sort(
    (a, b) => a.min_pax - b.min_pax
  );

  // Find the applicable price range
  const applicablePrice = sortedPrices.find(
    (p) => numberOfPax >= p.min_pax && numberOfPax <= p.max_pax
  );

  // If no range found, use the highest range's price
  if (!applicablePrice) {
    const highestRange = sortedPrices[sortedPrices.length - 1];
    if (numberOfPax > highestRange.max_pax) {
      return highestRange.price;
    }
    return 0; // Return 0 if pax is below minimum
  }

  return applicablePrice.price;
};

// Update the getDateSpecificPrice function
const getDateSpecificPrice = (theme, date) => {
  // console.log("Masuk getDateSpecificPrice");
  // console.log("Theme: ", theme);
  // console.log("Date: ", date);

  if (
    !theme?.date_specific_prices ||
    theme.date_specific_prices.length === 0 ||
    !date
  )
    return null;

  const bookingDate = new Date(date);
  const applicableSurcharge = theme.date_specific_prices.find((p) => {
    const startDate = new Date(p.start_date);
    const endDate = new Date(p.end_date);
    return bookingDate >= startDate && bookingDate <= endDate;
  });

  // console.log("Applicable surcharge: ", applicableSurcharge);

  if (!applicableSurcharge) return null;

  return {
    type: applicableSurcharge.price_type, // 1 for fixed, 2 for percentage
    amount: applicableSurcharge.amount || 0,
  };
};

// Update the sessionPrice computed property
const sessionPrice = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );

  if (!selectedType) return formatPrice(0);

  let basePrice = 0;

  // Handle different price types
  if (selectedType.price_type === 1) {
    // Fixed price
    basePrice = selectedType.price;
  } else if (selectedType.price_type === 2) {
    // Pax-based pricing
    basePrice = getPaxBasedPrice(selectedType, formData.value.numberOfPax);
  }

  // Apply date-specific price adjustment if applicable
  const datePrice = getDateSpecificPrice(selectedType, formData.value.date);
  if (datePrice) {
    if (datePrice.type === 1) {
      // Fixed amount adjustment
      basePrice += datePrice.amount;
    } else if (datePrice.type === 2) {
      // Percentage adjustment
      const adjustment = (basePrice * datePrice.percentage) / 100;
      basePrice += adjustment;
    }
  }

  return formatPrice(basePrice);
});

// Update the totalAmount computed property
const totalAmount = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );

  if (!selectedType) return 0;

  let basePrice = 0;

  // Handle different price types
  if (selectedType.price_type === 1) {
    // Fixed price
    basePrice = selectedType.price;
  } else if (selectedType.price_type === 2) {
    // Pax-based pricing
    basePrice = getPaxBasedPrice(selectedType, formData.value.numberOfPax);
  }

  // Apply date-specific price adjustment
  const datePrice = getDateSpecificPrice(selectedType, formData.value.date);
  if (datePrice) {
    if (datePrice.type === 1) {
      // Fixed amount adjustment
      basePrice += datePrice.amount;
    } else if (datePrice.type === 2) {
      // Percentage adjustment
      const adjustment = (basePrice * datePrice.percentage) / 100;
      basePrice += adjustment;
    }
  }

  const addonsTotal = formData.value.addOns.reduce((total, addon) => {
    const addonData = addOns.value.find((a) => a.id === addon.id);
    return total + (addonData?.price || 0) * addon.quantity;
  }, 0);

  const extraPaxTotal = extraPaxCharge.value;

  return basePrice + addonsTotal + extraPaxTotal;
});

// Add a computed property to show price information
const priceInfo = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );

  if (!selectedType) return null;

  if (selectedType.price_type === 1) {
    return {
      type: "fixed",
      basePrice: formatPrice(selectedType.price),
    };
  } else if (selectedType.price_type === 2) {
    return {
      type: "pax-based",
      prices: selectedType.pax_prices.map((p) => ({
        range: `${p.min_pax}-${p.max_pax} pax`,
        price: formatPrice(p.price),
      })),
    };
  }

  return null;
});

// Add a computed property for date surcharge info
const dateSurchargeInfo = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );

  if (!selectedType?.date_specific_prices || !formData.value.date) return null;

  const surchargePercentage = getDateSpecificPrice(
    selectedType,
    formData.value.date
  );

  // console.log("Surcharge percentage: ", surchargePercentage);

  return surchargePercentage > 0
    ? {
        add_on_price: surchargePercentage.amount,
        amount:
          (getPaxBasedPrice(selectedType, formData.value.numberOfPax) *
            surchargePercentage.add_on_price) /
          100,
      }
    : null;
});

const depositAmount = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );
  return selectedType ? formatPrice(selectedType.deposit) : formatPrice(0);
});

// Validation functions
const validateField = (field) => {
  errors.value[field] = "";

  switch (field) {
    case "name":
      if (!formData.value.name) {
        errors.value.name = "Name is required";
      } else if (formData.value.name.length < 2) {
        errors.value.name = "Name must be at least 2 characters";
      }
      break;
    case "email":
      if (!formData.value.email) {
        errors.value.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        errors.value.email = "Please enter a valid email address";
      }
      break;
    case "phone":
      if (!formData.value.phone) {
        errors.value.phone = "Phone number is required";
      } else {
        // Remove all non-digit characters
        const cleanPhone = formData.value.phone.replace(/\D/g, "");

        // Check if number has 10-11 digits (excluding the '6' prefix if present)
        const phoneRegex = /^(?:6?([0-9]{10,11}))$/;
        const match = phoneRegex.test(cleanPhone);

        // Additional check to ensure proper Malaysian format (starts with 0 or 1)
        const numberWithoutPrefix = cleanPhone.startsWith("6")
          ? cleanPhone.slice(1)
          : cleanPhone;
        const startsWithValidDigit = /^[01]/.test(numberWithoutPrefix);

        if (!match || !startsWithValidDigit) {
          errors.value.phone =
            "Please enter a valid Malaysian phone number (10-11 digits)";
        } else {
          // Format the phone number to ensure it starts with '6'
          if (!cleanPhone.startsWith("6")) {
            formData.value.phone = "6" + cleanPhone;
          }
        }
      }
      break;
    case "source":
      if (!formData.value.source) {
        errors.value.source = "Please select how you found us";
      }
      break;
    case "sessionType":
      if (!formData.value.sessionType) {
        errors.value.sessionType = "Please select a theme";
      }
      break;
    case "date":
      if (!formData.value.date) {
        errors.value.date = "Please select a date";
      }
      break;
    case "timeSlot":
      if (!formData.value.timeSlot) {
        errors.value.timeSlot = "Please select a time slot";
      }
      break;
    case "terms":
      if (!formData.value.termsAccepted) {
        errors.value.terms = "You must accept the terms and conditions";
      }
      break;
    case "numberOfPax":
      const selectedType = sessionTypes.value.find(
        (t) => t.id === formData.value.sessionType
      );

      if (
        formData.value.numberOfPax === undefined ||
        isNaN(formData.value.numberOfPax) ||
        formData.value.numberOfPax === 0
      ) {
        errors.value.numberOfPax = "Please select number of persons";
        return;
      } else if (selectedType?.price_type === 2) {
        const pax = parseInt(formData.value.numberOfPax);
        const sortedPrices = [...selectedType.pax_prices].sort(
          (a, b) => a.min_pax - b.min_pax
        );
        const minPax = sortedPrices[0].min_pax;
        const maxPax = sortedPrices[sortedPrices.length - 1].max_pax;

        if (pax < minPax) {
          formData.value.numberOfPax = minPax;
          errors.value.numberOfPax = `Minimum ${minPax} persons required`;
        } else if (pax > maxPax) {
          formData.value.numberOfPax = maxPax;
          errors.value.numberOfPax = `Maximum ${maxPax} persons allowed`;
        }
      } else {
        // Default validation for non-pax-based themes
        const paxValue = parseInt(formData.value.numberOfPax);
        if (paxValue < 1) {
          errors.value.numberOfPax = "Minimum 1 person required";
          return;
        } else if (paxValue > MAX_PAX.value) {
          formData.value.numberOfPax = MAX_PAX.value;
          errors.value.numberOfPax = "Maximum 20 persons allowed";
        }
      }
      break;
    case "customNumberOfPax":
      if (formData.value.numberOfPax === "more") {
        if (!formData.value.customNumberOfPax) {
          errors.value.customNumberOfPax =
            "Please enter number of extra persons";
        } else if (parseInt(formData.value.customNumberOfPax) < 1) {
          errors.value.customNumberOfPax = "Number must be at least 1";
        } else if (parseInt(formData.value.customNumberOfPax) > 20) {
          errors.value.customNumberOfPax = "Maximum 20 extra persons allowed";
        }
      }
      break;
    case "paymentMethod":
      if (!formData.value.paymentMethod) {
        errors.value.paymentMethod = "Please select a payment method";
      }
      break;
  }
};

// Form navigation and validation
const validateStep = (step) => {
  switch (step) {
    case 1:
      validateField("sessionType");
      return !errors.value.sessionType;
    case 2:
      validateField("date");
      validateField("timeSlot");
      return !errors.value.date && !errors.value.timeSlot;
    case 3:
      // Add-ons are optional, so always return true
      return true;
    case 4:
      validateField("name");
      validateField("email");
      validateField("phone");
      validateField("source");
      validateField("terms");
      validateField("numberOfPax");
      return (
        !errors.value.name &&
        !errors.value.email &&
        !errors.value.phone &&
        !errors.value.source &&
        !errors.value.terms &&
        !errors.value.numberOfPax
      );
    case 5:
      validateField("paymentMethod");
      return !errors.value.paymentMethod;
    default:
      return true;
  }
};

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Add this function to convert 12-hour to 24-hour format
const convertTo24Hour = (time12h) => {
  if (typeof time12h !== "string") {
    console.error("Invalid time format:", time12h);
    return "";
  }

  const [time, modifier] = time12h.split(" ");
  if (!time || !modifier) {
    console.error("Invalid time format:", time12h);
    return "";
  }

  let [hours, minutes] = time.split(":");

  // Convert hours to number for calculation
  hours = parseInt(hours);

  if (hours === 12) {
    hours = modifier === "PM" ? 12 : 0;
  } else if (modifier === "PM") {
    hours += 12;
  }

  const hoursStr = hours.toString().padStart(2, "0");
  return `${hoursStr}:${minutes}`;
};

// Add this function to format date to YYYY-MM-DD
const formatToYYYYMMDD = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

// Update the processPayment function
const processPayment = async () => {
  if (!validateStep(5)) return;
  isProcessing.value = true;

  try {
    // Convert time to 24-hour format
    const time24h = convertTo24Hour(formData.value.timeSlot);
    const formattedDate = formatToYYYYMMDD(formData.value.date);

    // Get selected theme details
    const selectedType = sessionTypes.value.find(
      (t) => t.id === formData.value.sessionType
    );

    // Calculate total number of persons
    const totalPax = parseInt(formData.value.numberOfPax);

    // Create booking data
    const bookingData = {
      // Session Details
      date: formattedDate,
      time: formData.value.timeSlot,
      theme: formData.value.sessionType,
      number_of_pax: totalPax,
      add_ons: formData.value.addOns.map((addon) => ({
        id: addon.id,
        quantity: addon.quantity,
      })),

      // Customer Details
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone.replace(/\D/g, ""),
      source: formData.value.source,

      // Payment Details
      payment_type: formData.value.paymentType === "full" ? 1 : 2, // 1 = full, 2 = deposit
      payment_method: formData.value.paymentMethod === "chip" ? 1 : 2, // 1 = chip, 2 = manual
      payment_amount:
        formData.value.paymentType === "full"
          ? totalAmount.value
          : selectedType?.deposit || 0,
      termsAccepted: formData.value.termsAccepted,

      // Referral
      referral: referral.value,
    };

    // Call the proceed API which will now handle both CHIP and manual payment
    const response = await $fetch("/api/booking/proceed", {
      method: "POST",
      body: bookingData,
    });

    if (response.status === "success") {
      if (
        formData.value.paymentMethod === "chip" &&
        response.data.checkout_url
      ) {
        // Redirect to CHIP payment page
        window.location.href = response.data.checkout_url;
      } else if (formData.value.paymentMethod === "manual") {
        // Redirect to manual payment receipt page
        navigateTo(response.data);
      }
    } else {
      throw new Error(response.message || "Failed to process booking");
    }
  } catch (error) {
    console.error("Booking error:", error);
    alert(
      error.data?.message || "An error occurred while processing your booking"
    );
  } finally {
    isProcessing.value = false;
  }
};

// Function to handle step navigation
const goToStep = (stepNumber) => {
  // Only allow going to completed steps or next step
  if (stepNumber <= currentStep.value || stepNumber === currentStep.value + 1) {
    if (validateStep(currentStep.value)) {
      currentStep.value = stepNumber;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
};

// Add a Terms Modal component
const showTerms = ref(false);

// Add new refs and functions for slide dates
const slideDates = (direction) => {
  if (!dateScrollContainer.value) return;

  const container = dateScrollContainer.value;
  const scrollAmount = 336; // 3 cards (100px width + 16px gap per card)

  if (direction === "prev") {
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
};

// Update the scrollToDate function
const scrollToDate = (date) => {
  if (!date || !dateScrollContainer.value) return;

  nextTick(() => {
    const dateButton = dateScrollContainer.value.querySelector(
      `[data-date="${date}"]`
    );

    if (dateButton) {
      const weekCard = dateButton.closest(".week-card");
      if (weekCard) {
        const container = dateScrollContainer.value;
        const scrollLeft =
          weekCard.offsetLeft -
          container.clientWidth / 2 +
          weekCard.clientWidth / 2;

        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: "smooth",
        });
      }
    }
  });
};

// Selected theme
const selectedTheme = computed(() => {
  return sessionTypes.value.find(
    (type) => type.id === formData.value.sessionType
  );
});

// Add a watch to reset customNumberOfPax when numberOfPax changes
watch(
  () => formData.value.numberOfPax,
  (newValue) => {
    if (newValue !== "more") {
      formData.value.customNumberOfPax = "";
      errors.value.customNumberOfPax = "";
    }
  }
);

// Add function to handle add-on selection
const selectAddOn = (value) => {
  const addon = addOns.value.find((a) => a.id === value);
  if (addon && addon.status == 1) {
    // Changed from addon.available to addon.status == 1
    formData.value.addOns.push({ id: addon.id, quantity: 1 });
  }
};

// Add a computed property to display the number of persons
const displayNumberOfPax = computed(() => {
  return `${formData.value.numberOfPax} persons`;
});

// Add a computed property to calculate the total amount
const totalAddOnsAmount = computed(() => {
  return formData.value.addOns.reduce((total, addon) => {
    const addonData = addOns.value.find((a) => a.id === addon.id);
    return total + (addonData?.price || 0) * addon.quantity;
  }, 0);
});

// Add a computed property to calculate the balance amount
const balanceAmount = computed(() => {
  if (formData.value.paymentType !== "deposit") return formatPrice(0);

  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );
  if (!selectedType) return formatPrice(0);

  const deposit = selectedType.deposit || 0;
  const total = totalAmount.value; // This already includes base price, peak adjustments, add-ons, and extra pax charges

  return formatPrice(Math.max(0, total - deposit));
});

// Add a computed property to get the selected add-on
const selectedAddOns = computed(() => {
  return formData.value.addOns.map((addon) => {
    const addonData = addOns.value.find((a) => a.id === addon.id);
    return { ...addonData, quantity: addon.quantity };
  });
});

const amountToPay = computed(() => {
  if (formData.value.paymentType === "deposit") {
    const selectedType = sessionTypes.value.find(
      (t) => t.id === formData.value.sessionType
    );
    return formatPrice(selectedType?.deposit || 0);
  } else {
    const basePrice =
      sessionTypes.value.find((t) => t.id === formData.value.sessionType)
        ?.price || 0;
    const addonsTotal = formData.value.addOns.reduce((total, addon) => {
      const addonData = addOns.value.find((a) => a.id === addon.id);
      return total + (addonData?.price || 0) * addon.quantity;
    }, 0);
    return formatPrice(basePrice + addonsTotal);
  }
});

const resetForm = () => {
  formData.value = {
    name: "",
    email: "",
    phone: "",
    source: "",
    termsAccepted: false,
    date: "",
    timeSlot: "",
    sessionType: "",
    numberOfPax: 0,
    addOns: [],
    paymentType: "deposit",
    paymentMethod: "chip", // Add default payment method
    value: {
      timeSlot: "",
    },
  };
};

// Add these new methods
const hasAddon = (addonId) => {
  return formData.value.addOns.some((addon) => addon.id === addonId);
};

const getAddonQuantity = (addonId) => {
  const addon = formData.value.addOns.find((addon) => addon.id === addonId);
  return addon ? addon.quantity : 0;
};

const incrementAddon = (addonId) => {
  const existingAddon = formData.value.addOns.find(
    (addon) => addon.id === addonId
  );
  if (existingAddon) {
    existingAddon.quantity++;
  } else {
    formData.value.addOns.push({ id: addonId, quantity: 1 });
  }
};

const decrementAddon = (addonId) => {
  const index = formData.value.addOns.findIndex(
    (addon) => addon.id === addonId
  );
  if (index !== -1) {
    if (formData.value.addOns[index].quantity > 1) {
      formData.value.addOns[index].quantity--;
    } else {
      formData.value.addOns.splice(index, 1);
    }
  }
};

// Add these new functions and computed properties in the script section:
const EXTRA_PAX_CHARGE = ref(0); // RM20 per additional pax
const MAX_FREE_PAX = ref(10);
const MAX_PAX = ref(20);

const extraPaxCharge = computed(() => {
  const pax = parseInt(formData.value.numberOfPax) || 0;
  return pax > MAX_FREE_PAX.value
    ? (pax - MAX_FREE_PAX.value) * EXTRA_PAX_CHARGE.value
    : 0;
});

const incrementPax = () => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );

  const currentPax = parseInt(formData.value.numberOfPax) || 0;
  let maxPax = MAX_PAX.value;

  if (selectedType?.price_type === 2) {
    const sortedPrices = [...selectedType.pax_prices].sort(
      (a, b) => a.min_pax - b.min_pax
    );
    maxPax = sortedPrices[sortedPrices.length - 1].max_pax;
  }

  if (currentPax < maxPax) {
    formData.value.numberOfPax = currentPax + 1;
    validateField("numberOfPax");
  }
};

const decrementPax = () => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );

  const currentPax = parseInt(formData.value.numberOfPax) || 0;
  let minPax = 0; // Changed back to 0 to allow decrementing to 0

  if (selectedType?.price_type === 2) {
    const sortedPrices = [...selectedType.pax_prices].sort(
      (a, b) => a.min_pax - b.min_pax
    );
    minPax = sortedPrices[0].min_pax;
  }

  if (currentPax > minPax) {
    formData.value.numberOfPax = currentPax - 1;
    validateField("numberOfPax");
  }
};

const handlePaxInput = (event) => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );

  let minPax = 0;
  let maxPax = MAX_PAX.value;

  if (selectedType?.price_type === 2) {
    const sortedPrices = [...selectedType.pax_prices].sort(
      (a, b) => a.min_pax - b.min_pax
    );
    minPax = sortedPrices[0].min_pax;
    maxPax = sortedPrices[sortedPrices.length - 1].max_pax;
  }

  let value = parseInt(event.target.value);
  if (isNaN(value)) value = 0;
  value = Math.max(minPax, Math.min(maxPax, value));
  formData.value.numberOfPax = value;
  validateField("numberOfPax");
};

// Add a watch effect to refetch slots when theme changes
watch(
  () => formData.value.sessionType,
  async (newTheme) => {
    if (newTheme) {
      // Reset date and time selection
      formData.value.date = "";
      formData.value.timeSlot = "";
      formData.value.value.timeSlot = "";

      // Fetch slots for the current month with the new theme
      // await fetchSlotsData(currentMonth.value + 1);
    }
  }
);

// Add a new computed property for price range warning
const paxPriceWarning = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );

  if (!selectedType || selectedType.price_type !== 2) return null;

  const pax = formData.value.numberOfPax;
  const sortedPrices = [...selectedType.pax_prices].sort(
    (a, b) => a.min_pax - b.min_pax
  );

  // Check if pax is within any range
  const isInRange = sortedPrices.some(
    (p) => pax >= p.min_pax && pax <= p.max_pax
  );

  if (!isInRange) {
    if (pax < sortedPrices[0].min_pax) {
      return `Minimum ${sortedPrices[0].min_pax} pax required`;
    } else if (pax > sortedPrices[sortedPrices.length - 1].max_pax) {
      return `Maximum ${
        sortedPrices[sortedPrices.length - 1].max_pax
      } pax allowed`;
    }
  }

  return null;
});

// Add a helper function to convert date to Malaysia timezone
const convertToMYTime = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
};

// Update the selectedDatePeakInfo computed property
const selectedDatePeakInfo = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );
  if (!selectedType?.date_specific_prices || !formData.value.date) return null;

  // Convert the selected date to MY timezone
  const selectedDate = convertToMYTime(formData.value.date);
  selectedDate.setHours(0, 0, 0, 0); // Set to start of day

  const datePrice = getDateSpecificPrice(selectedType, formData.value.date);
  if (!datePrice) return null;

  const basePrice =
    selectedType.price_type === 1
      ? selectedType.price
      : getPaxBasedPrice(selectedType, formData.value.numberOfPax);

  if (datePrice.type === 1) {
    // For fixed amount
    const percentageChange = (datePrice.amount / basePrice) * 100;
    return {
      type: "fixed",
      add_on_price: formatPrice(datePrice.amount),
      amount: formatPrice(datePrice.amount),
      isPositive: datePrice.amount > 0,
    };
  } else {
    // For percentage
    return {
      type: "percentage",
      add_on_price: datePrice.amount,
      amount: formatPrice((basePrice * datePrice.amount) / 100),
      isPositive: datePrice.amount > 0,
    };
  }
});

// Update the isDateInPeakPeriod function
const isDateInPeakPeriod = (date) => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );

  if (!selectedType?.date_specific_prices || !date) return false;

  // Convert the date to MY timezone
  const checkDate = convertToMYTime(date);
  checkDate.setHours(0, 0, 0, 0); // Set to start of day

  const peakPeriod = selectedType.date_specific_prices.find((p) => {
    const startDate = convertToMYTime(p.start_date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = convertToMYTime(p.end_date);
    endDate.setHours(23, 59, 59, 999);

    return checkDate >= startDate && checkDate <= endDate;
  });

  return !!peakPeriod;
};

// Add function to go to next step
function goToNextStep() {
  if (currentStep.value < steps.length) {
    currentStep.value++;
  }
}

// Add function to go to previous step
function goToPrevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

// Add a watch for currentDate changes
watch(
  currentDate,
  (newDate) => {
    // console.log("Current date changed:", newDate);
    // console.log("New month:", newDate.getMonth());
    // console.log("New year:", newDate.getFullYear());
  },
  { deep: true }
);

// Add these new computed properties
const basePrice = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );
  if (!selectedType) return 0;

  // For fixed price type
  if (selectedType.price_type === 1) {
    return selectedType.price;
  }

  // For pax-based pricing
  return getPaxBasedPrice(selectedType, formData.value.numberOfPax);
});

const paxAdjustment = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );
  if (!selectedType || selectedType.price_type !== 2) return 0;

  const basePaxPrice = selectedType.pax_prices[0]?.price || 0;
  const actualPaxPrice = getPaxBasedPrice(
    selectedType,
    formData.value.numberOfPax
  );
  return actualPaxPrice - basePaxPrice;
});

const peakPeriodAdjustment = computed(() => {
  const selectedType = sessionTypes.value.find(
    (t) => t.id === formData.value.sessionType
  );
  if (!selectedType || !formData.value.date) return 0;

  const datePrice = getDateSpecificPrice(selectedType, formData.value.date);
  if (!datePrice) return 0;

  if (datePrice.type === 1) {
    // Fixed amount adjustment
    return datePrice.amount;
  } else {
    // Percentage adjustment
    return (basePrice.value * datePrice.amount) / 100;
  }
});

const subtotalBeforeAdjustments = computed(() => {
  return basePrice.value + totalAddOnsAmount.value + peakPeriodAdjustment.value;
});

const hasAnyAdjustments = computed(() => {
  return selectedDatePeakInfo.value || extraPaxCharge.value > 0;
});

// Add this near your other computed properties
const formattedTNC = computed(() => {
  if (!TNC.value) return "";
  return String(TNC.value).trim();
});
</script>

<style lang="scss" scoped>
/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
}

.form-group {
  @apply relative;
}

.form-input {
  @apply block w-full px-3 sm:px-4 pt-5 sm:pt-6 pb-1.5 sm:pb-2 bg-white border rounded-xl appearance-none;
  @apply border-[var(--color-border-primary)];
  @apply focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)];
  @apply placeholder-transparent;
  font-size: 16px; /* Base font size for mobile */
  line-height: 1.25;
  transition: var(--transition-all);

  @screen sm {
    font-size: 16px; /* Keep it 16px even on desktop for consistency */
  }

  &.error {
    @apply border-red-500;
    &:focus {
      @apply ring-red-200 border-red-500;
    }
  }
}

.form-label {
  @apply absolute left-3 sm:left-4 top-4 sm:top-4 cursor-text;
  @apply pointer-events-none select-none;
  color: var(--color-text-muted);
  font-size: 16px; /* Base font size for mobile */
  line-height: 1.25;
  transition: all 0.2s ease;
  transform-origin: 0 0;

  @screen sm {
    font-size: 16px; /* Keep it 16px even on desktop for consistency */
  }

  .form-input:focus + &,
  .form-input:not(:placeholder-shown) + & {
    @apply transform -translate-y-2;
    font-size: 12px; /* Smaller font size when label is floating */
    color: var(--color-primary);
  }

  .form-input.error:focus + &,
  .form-input.error:not(:placeholder-shown) + & {
    @apply text-red-500;
  }
}

.form-error {
  @apply mt-1.5 text-xs text-red-500;
}

/* Custom Select Styles */
select.form-input {
  font-size: 16px !important; /* Force 16px for select elements */

  & + .form-label {
    font-size: 12px;
    @apply -translate-y-2;
    color: var(--color-text-muted);
  }

  &:focus + .form-label {
    color: var(--color-primary);
  }
}

/* Number Input Styles */
input[type="number"].form-input {
  @apply pr-2;
  font-size: 16px !important; /* Force 16px for number inputs */

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    @apply m-0;
    -webkit-appearance: none;
  }
  -moz-appearance: textfield;
}

.btn {
  @apply inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium rounded-xl;
  transition: var(--transition-all);
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95;

  &.btn-primary {
    color: var(--color-text-light);
    background-color: var(--color-primary);
    @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100;

    &:hover {
      background-color: var(--color-primary-light);
    }
    &:focus {
      @apply ring-2;
      ring-color: var(--color-primary);
    }
  }

  &.btn-secondary {
    color: var(--color-primary);
    background-color: var(--color-bg-light);
    border: 1px solid var(--color-border-primary);

    &:hover {
      background-color: var(--color-bg-primary);
    }
    &:focus {
      @apply ring-2;
      ring-color: var(--color-primary);
    }
  }
}

/* Custom Checkbox */
.custom-checkbox {
  @apply relative inline-block;
}

.checkbox-label {
  @apply block w-5 h-5 rounded cursor-pointer;
  border: 2px solid var(--color-border-secondary);
  transition: var(--transition-all);

  &:hover {
    border-color: var(--color-primary);
  }

  &.checkbox-error {
    @apply border-red-500;
  }
}

.checkbox-icon {
  @apply absolute inset-0 w-full h-full opacity-0 scale-50;
  color: var(--color-text-light);
  transition: var(--transition-all);
}

input:checked + .checkbox-label {
  background-color: var(--color-primary);
  border-color: var(--color-primary);

  .checkbox-icon {
    @apply opacity-100 scale-100;
  }
}

input:focus + .checkbox-label {
  @apply ring-2;
  ring-color: var(--color-primary);
  ring-opacity: 0.2;
}

/* Enhanced Custom select styling */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
  cursor: pointer;
  font-family: var(--font-primary);
}

select::-ms-expand {
  display: none;
}

/* Style for the option elements */
select option {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--text-base);
  background-color: var(--color-bg-light);
  color: var(--color-primary);
  font-family: var(--font-primary);
  border: none;
  cursor: pointer;
  transition: var(--transition-all);
}

/* Style for option hover and selected states */
select option:checked,
select option:hover {
  background: var(--gradient-background);
  color: var(--color-primary);
}

/* Style for Firefox */
@-moz-document url-prefix() {
  select {
    color: var(--color-primary);
    background-color: var(--color-bg-light);
    padding-right: var(--spacing-12);
  }

  select option {
    background-color: var(--color-bg-light);
    color: var(--color-primary);
  }

  select option:checked,
  select option:hover {
    box-shadow: 0 0 10px 100px var(--color-bg-primary) inset;
    color: var(--color-primary);
  }
}

/* Style for Webkit browsers */
select:focus {
  border-color: var(--color-border-primary);
  outline: none;
}

select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px var(--color-bg-light) inset;
  -webkit-text-fill-color: var(--color-primary);
}

/* Theme Card Styles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth image scale transition */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

/* Animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom number input styles for the stepper */
.form-input[type="number"] {
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
}

/* Stepper input specific styles */
.form-input[type="number"].text-center {
  padding-top: 0;
  padding-bottom: 0;
  height: 48px;
  line-height: 48px;
}

/* Markdown Content Styles */
.prose {
  @apply text-[var(--color-text-primary)];

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply text-[var(--color-text-primary)] font-semibold mb-4;
  }

  h1 {
    @apply text-2xl;
  }

  h2 {
    @apply text-xl;
  }

  h3 {
    @apply text-lg;
  }

  p {
    @apply mb-4 text-[var(--color-text-muted)];
  }

  ul,
  ol {
    @apply mb-4 pl-5;
  }

  li {
    @apply mb-2 text-[var(--color-text-muted)];
  }

  a {
    @apply text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] underline;
  }

  blockquote {
    @apply border-l-4 border-[var(--color-border-primary)] pl-4 italic my-4;
  }

  code {
    @apply bg-[var(--color-bg-light)] px-1 py-0.5 rounded text-sm;
  }

  pre {
    @apply bg-[var(--color-bg-light)] p-4 rounded-lg overflow-x-auto my-4;
  }

  hr {
    @apply my-8 border-[var(--color-border-primary)];
  }

  table {
    @apply w-full border-collapse my-4;

    th,
    td {
      @apply border border-[var(--color-border-primary)] px-4 py-2;
    }

    th {
      @apply bg-[var(--color-bg-light)] font-semibold;
    }
  }
}
</style>
