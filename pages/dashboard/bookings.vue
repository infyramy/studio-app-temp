<template>
  <div class="space-y-6">
    <div class="flex flex-col">
      <h1 class="text-2xl font-bold">Bookings</h1>
      <span class="text-md"> View all your bookings here </span>
    </div>

    <!-- Stats Cards -->
    <div class="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <!-- Confirmed Bookings Card -->
      <div
        class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-3 sm:p-4">
          <div class="flex flex-col">
            <span
              class="text-[10px] xs:text-xs sm:text-sm font-medium text-blue-600"
              >Total Confirmed</span
            >
            <span
              class="mt-0.5 sm:mt-1 lg:mt-2 text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900"
              >{{ stats.confirmed }}</span
            >
          </div>
        </div>
      </div>

      <!-- Partially Paid Card -->
      <div
        class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-3 sm:p-4">
          <div class="flex flex-col">
            <span
              class="text-[10px] xs:text-xs sm:text-sm font-medium text-amber-600"
              >Partially Paid</span
            >
            <span
              class="mt-0.5 sm:mt-1 lg:mt-2 text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900"
              >{{ stats.partiallyPaid }}</span
            >
          </div>
        </div>
      </div>

      <!-- Total Frames Card -->
      <div
        class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-3 sm:p-4">
          <div class="flex flex-col">
            <span
              class="text-[10px] xs:text-xs sm:text-sm font-medium text-emerald-600"
              >Total Frames</span
            >
            <span
              class="mt-0.5 sm:mt-1 lg:mt-2 text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-900"
              >{{ stats.totalFrames }}</span
            >
          </div>
        </div>
      </div>

      <!-- Total Sales Card -->
      <div
        class="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-3 sm:p-4">
          <div class="flex flex-col">
            <span
              class="text-[10px] xs:text-xs sm:text-sm font-medium text-violet-600"
              >Total Sales</span
            >
            <span
              class="mt-0.5 sm:mt-1 lg:mt-2 text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-violet-900 whitespace-nowrap sm:max-w-none"
              >RM {{ formatNumber(stats.totalSales) }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-6"
    >
      <!-- Table Header Actions -->
      <div class="p-4 sm:p-6 space-y-4 border-b border-gray-100">
        <!-- Top Row: Search and Export -->
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
        >
          <!-- Search Input -->
          <div class="relative flex-1 min-w-0">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search bookings..."
              class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
              @input="handleSearch"
            />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          <!-- Export Button -->
          <button
            class="inline-flex items-center justify-center px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 whitespace-nowrap gap-2"
            @click="exportToCSV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 sm:mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span class="">Export</span>
          </button>
        </div>

        <!-- Bottom Row: Filters Toggle -->
        <div class="flex items-center justify-between">
          <button
            class="text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200 flex items-center gap-2"
            @click="isFiltersVisible = !isFiltersVisible"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              :class="{ 'rotate-180': isFiltersVisible }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Filters
          </button>
        </div>

        <!-- Filters Section -->
        <div
          v-show="isFiltersVisible"
          class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100"
        >
          <span class="text-sm font-medium text-gray-500 whitespace-nowrap"
            >Filters:</span
          >

          <div
            class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <!-- Date Range -->
            <div
              class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto"
            >
              <div class="relative flex-1 sm:flex-none">
                <input
                  v-model="filters.startDate"
                  type="date"
                  class="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                  :max="filters.endDate || undefined"
                  @change="handleFiltersChange"
                />
                <div
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
              <span class="text-sm text-gray-400 hidden sm:inline">to</span>
              <div class="relative flex-1 sm:flex-none">
                <input
                  v-model="filters.endDate"
                  type="date"
                  class="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                  :min="filters.startDate || undefined"
                  @change="handleFiltersChange"
                />
                <div
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
            </div>

            <div class="h-px w-full sm:h-5 sm:w-px bg-gray-200"></div>

            <!-- Status Filters -->
            <div
              class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <div class="relative flex-1 sm:flex-none">
                <select
                  v-model="filters.paymentStatus"
                  class="w-full appearance-none pl-9 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                  @change="handleFiltersChange"
                >
                  <option :value="null">All Payments</option>
                  <option
                    v-for="status in paymentStatusOptions"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
                <div
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
              </div>

              <div class="relative flex-1 sm:flex-none">
                <select
                  v-model="filters.sessionStatus"
                  class="w-full appearance-none pl-9 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                  @change="handleFiltersChange"
                >
                  <option :value="null">All Sessions</option>
                  <option
                    v-for="status in sessionStatusOptions"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ status.label }}
                  </option>
                </select>
                <div
                  class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Reset Button -->
            <button
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200 whitespace-nowrap"
              @click="resetFilters"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path
                  d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                ></path>
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <div v-if="loading" class="flex justify-center items-center p-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
          ></div>
        </div>

        <div v-else class="min-w-full divide-y divide-gray-100">
          <!-- Desktop Table View -->
          <table class="min-w-full divide-y divide-gray-100 hidden sm:table">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="(column, index) in [
                    'No',
                    'Ref No',
                    'Customer',
                    'Session Slot',
                    'Theme',
                    'Referral',
                    'Payment Status',
                    'Session Status',
                    'Frame Status',
                    'Action',
                  ]"
                  :key="index"
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors duration-200"
                  @click="
                    handleSortChange({
                      prop: (index === 0
                        ? 'id'
                        : index === 1
                        ? 'id'
                        : index === 2
                        ? 'user_fullname'
                        : index === 3
                        ? 'session_date'
                        : index === 4
                        ? 'theme'
                        : index === 5
                        ? 'user_source'
                        : index === 6
                        ? 'status'
                        : index === 7
                        ? 'session_status'
                        : 'frame_status') as keyof Booking,
                      order:
                        sortBy.prop ===
                          (index === 0
                            ? 'id'
                            : index === 1
                            ? 'id'
                            : index === 2
                            ? 'user_fullname'
                            : index === 3
                            ? 'session_date'
                            : index === 4
                            ? 'theme'
                            : index === 5
                            ? 'user_source'
                            : index === 6
                            ? 'status'
                            : index === 7
                            ? 'session_status'
                            : 'frame_status') && sortBy.order === 'ascending'
                          ? 'descending'
                          : 'ascending',
                    })
                  "
                >
                  <div class="flex items-center gap-2">
                    {{ column }}
                    <span
                      v-if="
                        sortBy.prop ===
                        (index === 0
                          ? 'id'
                          : index === 1
                          ? 'id'
                          : index === 2
                          ? 'user_fullname'
                          : index === 3
                          ? 'session_date'
                          : index === 4
                          ? 'theme'
                          : index === 5
                          ? 'user_source'
                          : index === 6
                          ? 'status'
                          : index === 7
                          ? 'session_status'
                          : 'frame_status')
                      "
                      class="text-blue-500"
                    >
                      {{ sortBy.order === "ascending" ? "↑" : "↓" }}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="(booking, index) in paginatedBookings"
                :key="booking.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ booking.payment_ref_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-900">{{
                      booking.user_fullname
                    }}</span>
                    <span class="text-sm text-gray-500">{{
                      booking.user_email
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-900">{{
                      formatDate(booking.session_date)
                    }}</span>
                    <span class="text-sm text-gray-500">{{
                      formatTime(booking.session_time)
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{
                    booking.theme_title || "Not specified"
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900 capitalize">{{
                    booking?.referral_code || "-"
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="relative">
                    <span
                      class="status-trigger"
                      :class="{
                        'px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-200': true,
                        'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20 hover:bg-yellow-100':
                          booking.status === 1,
                        'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 hover:bg-blue-100':
                          booking.status === 2,
                        'bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100':
                          booking.status === 3,
                        'bg-red-50 text-red-700 ring-1 ring-red-600/20 hover:bg-red-100':
                          booking.status === 4,
                      }"
                      @click="openStatusDropdown($event, booking, 'payment')"
                    >
                      {{ getPaymentStatusLabel(booking.status) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="relative">
                    <span
                      class="status-trigger"
                      :class="{
                        'px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-200': true,
                        'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20 hover:bg-yellow-100':
                          booking.session_status === 1,
                        'bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100':
                          booking.session_status === 2,
                        'bg-red-50 text-red-700 ring-1 ring-red-600/20 hover:bg-red-100':
                          booking.session_status === 3,
                      }"
                      @click="openStatusDropdown($event, booking, 'session')"
                    >
                      {{ getSessionStatusLabel(booking.session_status) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="relative">
                    <span
                      class="status-trigger"
                      :class="{
                        'px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-200': true,
                        'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 hover:bg-gray-100':
                          booking.frame_status === 1,
                        'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 hover:bg-blue-100':
                          booking.frame_status === 2,
                        'bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100':
                          booking.frame_status === 3,
                      }"
                      @click="openStatusDropdown($event, booking, 'frame')"
                    >
                      {{ getFrameStatusLabel(booking.frame_status) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <!-- Action Buttons -->
                  <div class="flex items-center gap-2">
                    <!-- More Actions -->
                    <button
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                      @click="openMoreActionsModal(booking)"
                      title="View Details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>

                    <!-- Receipt -->
                    <button
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                      @click="openReceiptModal(booking)"
                      title="View Receipt"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                        <line x1="18" y1="9" x2="18" y2="15"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Mobile List View -->
          <div class="sm:hidden">
            <div
              v-for="(booking, index) in paginatedBookings"
              :key="booking.id"
              class="p-4 border-b border-gray-100"
            >
              <div class="space-y-3">
                <!-- Customer Info -->
                <div class="flex justify-between items-start">
                  <div class="space-y-1">
                    <div class="font-medium text-gray-900">
                      {{ booking.user_fullname }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ booking.user_email }}
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      @click="openMoreActionsModal(booking)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>
                    <button
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                      @click="openReceiptModal(booking)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                        <line x1="18" y1="9" x2="18" y2="15"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Session Info -->
                <div class="flex justify-between items-center text-sm">
                  <div class="space-y-1">
                    <div class="text-gray-500">Session Date</div>
                    <div class="font-medium">
                      {{ formatDate(booking.session_date) }}
                    </div>
                  </div>
                  <div class="space-y-1 text-right">
                    <div class="text-gray-500">Session Time</div>
                    <div class="font-medium">
                      {{ formatTime(booking.session_time) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Footer -->
      <div
        class="table-footer px-4 sm:px-6 py-4 border-t border-gray-100 bg-white"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <!-- Entries Info -->
          <div
            class="flex items-center gap-4 text-sm text-gray-700 order-2 sm:order-1"
          >
            <span class="whitespace-nowrap">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to
              {{ Math.min(currentPage * pageSize, filteredBookings.length) }}
              of {{ filteredBookings.length }} entries
            </span>
            <select
              v-model="pageSize"
              class="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="size in [5, 10, 25, 50]" :key="size" :value="size">
                {{ size }} / page
              </option>
            </select>
          </div>

          <!-- Pagination -->
          <div class="flex gap-2 order-1 sm:order-2">
            <button
              class="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </button>
            <div class="hidden sm:flex gap-1">
              <button
                v-for="page in getPageNumbers()"
                :key="page"
                class="px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                :class="
                  currentPage === page
                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                    : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
                "
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </div>
            <button
              class="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="
                currentPage >= Math.ceil(filteredBookings.length / pageSize)
              "
              @click="currentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- More Actions Modal -->
  <Teleport to="body">
    <TransitionRoot appear :show="moreActionsVisible" as="template">
      <Dialog
        as="div"
        @close="moreActionsVisible = false"
        class="relative z-[100]"
      >
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
          <div class="flex min-h-full items-center justify-center p-4">
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
                class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all text-left"
              >
                <!-- Modal Header -->
                <div
                  class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100"
                >
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-50 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 text-blue-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">
                        Booking Details
                      </h3>
                      <p class="text-sm text-gray-500">
                        View and manage booking information
                      </p>
                    </div>
                  </div>
                  <button
                    class="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    @click="moreActionsVisible = false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Modal Content -->
                <div
                  class="p-4 sm:p-6 space-y-8 max-h-[calc(100vh-16rem)] overflow-y-auto"
                >
                  <!-- Customer Information -->
                  <section class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="p-2 bg-blue-50 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                            ></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <h4 class="text-base font-medium text-gray-900">
                          Customer Information
                        </h4>
                      </div>
                      <div class="flex gap-2">
                        <a
                          :href="'mailto:' + selectedBooking?.user_email"
                          class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                          title="Send Email"
                        >
                          <svg
                            class="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </a>
                        <a
                          :href="
                            'https://wa.me/' +
                            selectedBooking?.user_phoneno?.replace(/\D/g, '')
                          "
                          target="_blank"
                          class="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                          title="Send WhatsApp Message"
                        >
                          <svg
                            class="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div
                      class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100"
                    >
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Full Name</p>
                        <p class="text-sm font-medium text-gray-900">
                          {{ selectedBooking?.user_fullname }}
                        </p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Email</p>
                        <p class="text-sm font-medium text-gray-900">
                          {{ selectedBooking?.user_email }}
                        </p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Phone Number</p>
                        <p class="text-sm font-medium text-gray-900">
                          {{ selectedBooking?.user_phoneno }}
                        </p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Source</p>
                        <p class="text-sm font-medium text-gray-900 capitalize">
                          {{
                            selectedBooking?.user_source?.replace(/_/g, " ") ||
                            "Not specified"
                          }}
                        </p>
                      </div>
                    </div>
                  </section>

                  <!-- Session Details -->
                  <section class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="p-2 bg-violet-50 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 text-violet-500"
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
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>

                        <h4 class="text-base font-medium text-gray-900">
                          Session Details
                        </h4>
                      </div>

                      <div class="flex items-center gap-2">
                        <button
                          v-if="selectedBooking?.calendar_event_id == null"
                          class="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors duration-200"
                          @click="addToCalendar"
                        >
                          <svg
                            class="w-4 h-4"
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
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Add to Calendar
                        </button>
                        <button
                          v-else
                          class="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors duration-200"
                          @click="removeFromCalendar"
                        >
                          <svg
                            class="w-4 h-4"
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
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Remove from Calendar
                        </button>
                      </div>
                    </div>
                    <div
                      class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100"
                    >
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Session Date</p>
                        <p class="text-sm font-medium text-gray-900">
                          {{ formatDate(selectedBooking?.session_date) }}
                        </p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Session Time</p>
                        <p class="text-sm font-medium text-gray-900">
                          {{ formatTime(selectedBooking?.session_time) }}
                        </p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Theme</p>
                        <div class="flex items-center gap-2">
                          <p class="text-sm font-medium text-gray-900">
                            {{
                              selectedBooking?.theme_title || "Not specified"
                            }}
                          </p>
                          <span
                            v-if="selectedBooking?.theme_price"
                            class="text-xs text-gray-500"
                            >(RM
                            {{
                              formatNumber(selectedBooking?.theme_price)
                            }})</span
                          >
                        </div>
                      </div>
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Number of Pax</p>
                        <div class="flex items-center gap-2">
                          <p class="text-sm font-medium text-gray-900">
                            {{ selectedBooking?.number_of_pax || 0 }}
                          </p>
                          <span
                            v-if="selectedBooking?.number_of_extra_pax"
                            class="text-xs text-gray-500"
                            >(+{{
                              selectedBooking?.number_of_extra_pax
                            }}
                            extra)</span
                          >
                        </div>
                      </div>
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Session Status</p>
                        <span
                          :class="{
                            'px-3 py-1 text-xs font-medium rounded-full': true,
                            'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20':
                              selectedBooking?.session_status === 1,
                            'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                              selectedBooking?.session_status === 2,
                            'bg-red-50 text-red-700 ring-1 ring-red-600/20':
                              selectedBooking?.session_status === 3,
                          }"
                        >
                          {{
                            getSessionStatusLabel(
                              selectedBooking?.session_status || 1
                            )
                          }}
                        </span>
                      </div>
                      <div class="space-y-1">
                        <p class="text-sm text-gray-500">Frame Status</p>
                        <span
                          :class="{
                            'px-3 py-1 text-xs font-medium rounded-full': true,
                            'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20':
                              selectedBooking?.frame_status === 1,
                            'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20':
                              selectedBooking?.frame_status === 2,
                            'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                              selectedBooking?.frame_status === 3,
                          }"
                        >
                          {{
                            getFrameStatusLabel(
                              selectedBooking?.frame_status || 1
                            )
                          }}
                        </span>
                      </div>
                    </div>
                  </section>

                  <!-- Add-ons -->
                  <section
                    v-if="selectedBooking?.addons?.length"
                    class="space-y-4"
                  >
                    <div class="flex items-center gap-2">
                      <div class="p-2 bg-amber-50 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-5 h-5 text-amber-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"
                          ></path>
                          <rect x="6" y="4" width="12" height="8"></rect>
                          <line x1="12" y1="16" x2="12" y2="20"></line>
                          <line x1="9" y1="18" x2="15" y2="18"></line>
                        </svg>
                      </div>
                      <h4 class="text-base font-medium text-gray-900">
                        Add-ons
                      </h4>
                    </div>
                    <div
                      class="p-4 bg-gray-50/50 rounded-xl border border-gray-100"
                    >
                      <div class="divide-y divide-gray-200">
                        <div
                          v-for="(addon, index) in selectedBooking?.addons"
                          :key="index"
                          class="py-3 first:pt-0 last:pb-0"
                        >
                          <div class="flex justify-between items-center">
                            <div class="space-y-1">
                              <p class="text-sm font-medium text-gray-900">
                                {{ addon.title }}
                              </p>
                              <p class="text-xs text-gray-500">
                                Quantity: {{ addon.qty }}
                              </p>
                            </div>
                            <p class="text-sm font-medium text-gray-900">
                              RM {{ formatNumber(addon.price * addon.qty) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Payment Information -->
                  <section class="space-y-4">
                    <div class="flex items-center gap-2">
                      <div class="p-2 bg-emerald-50 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-5 h-5 text-emerald-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <rect
                            x="2"
                            y="4"
                            width="20"
                            height="16"
                            rx="2"
                          ></rect>
                          <line x1="2" y1="10" x2="22" y2="10"></line>
                        </svg>
                      </div>
                      <h4 class="text-base font-medium text-gray-900">
                        Payment Information
                      </h4>
                    </div>
                    <div
                      class="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-6"
                    >
                      <!-- Payment Status and Details -->
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="space-y-1">
                          <p class="text-sm text-gray-500">Payment Status</p>
                          <span
                            :class="{
                              'px-3 py-1 text-xs font-medium rounded-full': true,
                              'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20':
                                selectedBooking?.status === 1,
                              'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20':
                                selectedBooking?.status === 2,
                              'bg-green-50 text-green-700 ring-1 ring-green-600/20':
                                selectedBooking?.status === 3,
                              'bg-red-50 text-red-700 ring-1 ring-red-600/20':
                                selectedBooking?.status === 4,
                            }"
                          >
                            {{
                              getPaymentStatusLabel(
                                selectedBooking?.status || 0
                              )
                            }}
                          </span>
                        </div>
                        <div class="space-y-1">
                          <p class="text-sm text-gray-500">Payment Date</p>
                          <p class="text-sm font-medium text-gray-900">
                            {{
                              formatDate(selectedBooking?.payment_date) || "-"
                            }}
                          </p>
                        </div>
                        <div class="space-y-1">
                          <p class="text-sm text-gray-500">Reference Number</p>
                          <p class="text-sm font-medium text-gray-900">
                            {{ selectedBooking?.payment_ref_number || "-" }}
                          </p>
                        </div>
                        <div class="space-y-1">
                          <p class="text-sm text-gray-500">Transaction ID</p>
                          <p
                            class="text-sm font-medium font-mono text-gray-900"
                          >
                            {{ selectedBooking?.chip_purchase_id || "-" }}
                          </p>
                        </div>
                      </div>

                      <!-- Payment Breakdown -->
                      <div class="pt-4 space-y-3 border-t border-gray-200">
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-500">Theme Price</span>
                          <span class="font-medium text-gray-900"
                            >RM
                            {{
                              formatNumber(selectedBooking?.theme_price || 0)
                            }}</span
                          >
                        </div>
                        <div
                          v-if="selectedBooking?.payment_extra_pax"
                          class="flex justify-between text-sm"
                        >
                          <span class="text-gray-500">Extra Pax</span>
                          <span class="font-medium text-gray-900"
                            >RM
                            {{
                              formatNumber(
                                selectedBooking?.payment_extra_pax || 0
                              )
                            }}</span
                          >
                        </div>
                        <div
                          v-if="selectedBooking?.payment_addon_total"
                          class="flex justify-between text-sm"
                        >
                          <span class="text-gray-500">Add-ons Total</span>
                          <span class="font-medium text-gray-900"
                            >RM
                            {{
                              formatNumber(
                                selectedBooking?.payment_addon_total || 0
                              )
                            }}</span
                          >
                        </div>
                        <div
                          class="flex justify-between text-sm font-bold pt-3 border-t border-gray-200"
                        >
                          <span class="text-gray-900">Total Amount</span>
                          <span class="text-gray-900"
                            >RM
                            {{
                              formatNumber(selectedBooking?.payment_total || 0)
                            }}</span
                          >
                        </div>

                        <div
                          class="flex justify-between text-sm font-bold pt-3 border-t border-gray-200"
                        >
                          <span class="text-gray-900">Amount Paid</span>
                          <span class="text-gray-900"
                            >RM
                            {{
                              formatNumber(selectedBooking?.payment_amount || 0)
                            }}</span
                          >
                        </div>

                        <div
                          v-if="selectedBooking?.status == 2"
                          class="flex flex-col gap-2 text-sm font-bold pt-3"
                        >
                          <div class="flex justify-between">
                            <span class="text-gray-900">Amount Due</span>
                            <span class="text-gray-900"
                              >RM
                              {{
                                formatNumber(
                                  (selectedBooking?.payment_total || 0) -
                                    (selectedBooking?.payment_amount || 0)
                                )
                              }}</span
                            >
                          </div>

                          <div class="flex justify-end mt-4">
                            <button
                              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                              @click="sendPaymentReminder"
                            >
                              <span
                                class="flex items-center justify-center gap-2"
                              >
                                <svg
                                  class="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                >
                                  <path
                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                                  />
                                </svg>
                                Remind Customer
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <!-- Modal Footer -->
                <div
                  class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row gap-2"
                >
                  <button
                    v-if="selectedBooking?.session_status === 1"
                    class="w-full sm:w-auto px-4 py-2 text-red-600 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                    @click="openCancelModal"
                  >
                    Cancel Booking
                  </button>
                  <button
                    v-if="selectedBooking?.session_status === 1"
                    class="w-full sm:w-auto px-4 py-2 text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    @click="openChangeDateModal"
                  >
                    Change Date & Slot
                  </button>
                  <button
                    class="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    @click="moreActionsVisible = false"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>

  <!-- Change Date & Slot Modal -->
  <Teleport to="body">
    <TransitionRoot appear :show="changeDateModalVisible" as="template">
      <Dialog
        as="div"
        @close="changeDateModalVisible = false"
        class="relative z-[100]"
      >
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
          <div class="flex min-h-full items-center justify-center p-4">
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
                class="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
              >
                <!-- Modal Header -->
                <div
                  class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100"
                >
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-50 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 text-blue-500"
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
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">
                        Reschedule Booking
                      </h3>
                      <p class="text-sm text-gray-500">
                        Select a new date and time slot
                      </p>
                    </div>
                  </div>
                  <button
                    class="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    @click="changeDateModalVisible = false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Modal Content -->
                <div class="p-4 sm:p-6 space-y-4">
                  <!-- Date Selection -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Select Date
                    </label>
                    <input
                      v-model="newDate"
                      type="date"
                      class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      :min="minDate"
                      @change="handleDateChange"
                    />
                  </div>

                  <!-- Time Slots -->
                  <div v-if="newDate" class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Select Time Slot
                    </label>
                    <div class="grid grid-cols-2 gap-2" v-if="!loadingSlots">
                      <button
                        v-for="slot in availableTimeSlots"
                        :key="slot.value"
                        class="px-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                        :class="[
                          slot.value
                            ? newTimeSlot === slot.value
                              ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-gray-500'
                            : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed',
                        ]"
                        :disabled="!slot.value"
                        @click="newTimeSlot = slot.value"
                      >
                        {{ slot.slot }}
                      </button>
                    </div>
                    <div v-else class="flex justify-center py-4">
                      <div
                        class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div
                  class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row justify-end gap-2"
                >
                  <button
                    class="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    @click="changeDateModalVisible = false"
                  >
                    Cancel
                  </button>
                  <button
                    class="w-full sm:w-auto px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    :disabled="!newDate || !newTimeSlot || isUpdating"
                    @click="confirmChangeDateTime"
                  >
                    <span v-if="!isUpdating">Confirm Change</span>
                    <span v-else class="flex items-center justify-center gap-2">
                      <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                      ></div>
                      Updating...
                    </span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>

  <!-- Cancel Booking Modal -->
  <Teleport to="body">
    <TransitionRoot appear :show="cancelModalVisible" as="template">
      <Dialog
        as="div"
        @close="cancelModalVisible = false"
        class="relative z-[100]"
      >
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
          <div class="flex min-h-full items-center justify-center p-4">
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
                class="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
              >
                <!-- Modal Content -->
                <div class="p-4 sm:p-6">
                  <div
                    class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full"
                  >
                    <svg
                      class="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div class="mt-4 text-center">
                    <h3 class="text-lg font-medium text-gray-900">
                      Cancel Booking
                    </h3>
                    <p class="mt-2 text-sm text-gray-500">
                      Are you sure you want to cancel this booking? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div
                  class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row justify-end gap-2"
                >
                  <button
                    class="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    @click="cancelModalVisible = false"
                  >
                    No, Keep It
                  </button>
                  <button
                    class="w-full sm:w-auto px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                    :disabled="isCancelling"
                    @click="confirmCancelBooking"
                  >
                    <span v-if="!isCancelling">Yes, Cancel Booking</span>
                    <span v-else class="flex items-center justify-center gap-2">
                      <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                      ></div>
                      Cancelling...
                    </span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>

  <!-- Receipt Modal -->
  <Teleport to="body">
    <TransitionRoot appear :show="receiptModalVisible" as="template">
      <Dialog
        as="div"
        @close="receiptModalVisible = false"
        class="relative z-[100]"
      >
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
          <div class="flex min-h-full items-center justify-center p-4">
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
                class="w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
              >
                <!-- Modal Header -->
                <div
                  class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100"
                >
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-50 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 text-blue-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                        <line x1="18" y1="9" x2="18" y2="15"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">
                        Payment Receipt
                      </h3>
                      <p class="text-sm text-gray-500">
                        View and download receipt details
                      </p>
                    </div>
                  </div>
                  <button
                    class="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    @click="receiptModalVisible = false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <!-- Modal Content -->
                <div
                  class="p-4 sm:p-6 space-y-6 text-left bg-white"
                  id="receipt-content"
                >
                  <!-- Company Header -->
                  <div
                    class="flex items-center justify-between border-b border-gray-100 pb-6"
                  >
                    <div class="space-y-1">
                      <h4 class="text-xl font-bold text-gray-900">
                        Payment Receipt
                      </h4>
                      <p class="text-sm text-gray-500">
                        Receipt #{{ selectedBooking?.id }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{
                          formatDate(
                            selectedBooking?.payment_date ||
                              selectedBooking?.created_at
                          )
                        }}
                      </p>
                    </div>
                    <div class="text-right">
                      <div
                        v-if="isLogoLoading"
                        class="w-full h-full rounded-lg bg-gray-200 animate-pulse"
                      />

                      <img
                        v-else
                        :src="logo"
                        alt="Company Logo"
                        class="h-12 w-auto"
                      />
                    </div>
                  </div>

                  <!-- Receipt Details -->
                  <div class="space-y-6">
                    <!-- Customer & Booking Info -->
                    <div class="grid grid-cols-2 gap-6">
                      <!-- Customer Details -->
                      <div class="space-y-4">
                        <h5 class="font-medium text-gray-900">
                          Customer Details
                        </h5>
                        <div class="space-y-2 text-sm">
                          <div>
                            <p class="text-gray-500">Name</p>
                            <p class="font-medium text-gray-900">
                              {{ selectedBooking?.user_fullname }}
                            </p>
                          </div>
                          <div>
                            <p class="text-gray-500">Email</p>
                            <p class="font-medium text-gray-900">
                              {{ selectedBooking?.user_email }}
                            </p>
                          </div>
                          <div>
                            <p class="text-gray-500">Phone</p>
                            <p class="font-medium text-gray-900">
                              {{ selectedBooking?.user_phoneno }}
                            </p>
                          </div>
                          <div>
                            <p class="text-gray-500">Source</p>
                            <p class="font-medium text-gray-900 capitalize">
                              {{
                                selectedBooking?.user_source?.replace(
                                  /_/g,
                                  " "
                                ) || "Not specified"
                              }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Booking Details -->
                      <div class="space-y-4">
                        <h5 class="font-medium text-gray-900">
                          Booking Details
                        </h5>
                        <div class="space-y-2 text-sm">
                          <div>
                            <p class="text-gray-500">Session Date</p>
                            <p class="font-medium text-gray-900">
                              {{ formatDate(selectedBooking?.session_date) }}
                            </p>
                          </div>
                          <div>
                            <p class="text-gray-500">Session Time</p>
                            <p class="font-medium text-gray-900">
                              {{ formatTime(selectedBooking?.session_time) }}
                            </p>
                          </div>
                          <div>
                            <p class="text-gray-500">Theme</p>
                            <p class="font-medium text-gray-900">
                              {{
                                selectedBooking?.theme_title || "Not specified"
                              }}
                            </p>
                          </div>
                          <div>
                            <p class="text-gray-500">Number of Pax</p>
                            <div class="flex items-center gap-2">
                              <p class="font-medium text-gray-900">
                                {{ selectedBooking?.number_of_pax || 0 }}
                              </p>
                              <span
                                v-if="selectedBooking?.number_of_extra_pax"
                                class="text-xs text-gray-500"
                                >(+{{
                                  selectedBooking?.number_of_extra_pax
                                }}
                                extra)</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Payment Breakdown -->
                    <div class="space-y-4 border-t border-gray-100 pt-6">
                      <h5 class="font-medium text-gray-900">Payment Details</h5>

                      <!-- Base Price -->
                      <div class="space-y-3 text-sm">
                        <div class="flex justify-between items-center py-2">
                          <span class="text-gray-500">Theme Price</span>
                          <span class="font-medium text-gray-900"
                            >RM
                            {{
                              formatNumber(selectedBooking?.theme_price || 0)
                            }}</span
                          >
                        </div>

                        <!-- Extra Pax -->
                        <div
                          v-if="selectedBooking?.payment_extra_pax"
                          class="flex justify-between items-center py-2"
                        >
                          <div>
                            <span class="text-gray-500">Extra Pax</span>
                            <span class="text-xs text-gray-400 ml-1"
                              >({{
                                selectedBooking?.number_of_extra_pax
                              }}
                              pax)</span
                            >
                          </div>
                          <span class="font-medium text-gray-900"
                            >RM
                            {{
                              formatNumber(selectedBooking?.payment_extra_pax)
                            }}</span
                          >
                        </div>

                        <!-- Add-ons -->
                        <template v-if="selectedBooking?.addons?.length">
                          <div class="border-t border-gray-100 pt-2">
                            <p class="text-gray-500 mb-2">Add-ons</p>
                            <div
                              v-for="(addon, index) in selectedBooking.addons"
                              :key="index"
                              class="flex justify-between items-center py-1 pl-4"
                            >
                              <div>
                                <span class="text-gray-700">{{
                                  addon.title
                                }}</span>
                                <span class="text-xs text-gray-400 ml-1"
                                  >(x{{ addon.qty }})</span
                                >
                              </div>
                              <span class="font-medium text-gray-900"
                                >RM
                                {{
                                  formatNumber(addon.price * addon.qty)
                                }}</span
                              >
                            </div>
                          </div>
                        </template>

                        <!-- Subtotal -->
                        <div
                          class="flex justify-between items-center py-2 border-t border-gray-100"
                        >
                          <span class="text-gray-700 font-medium"
                            >Subtotal</span
                          >
                          <span class="font-medium text-gray-900"
                            >RM
                            {{
                              formatNumber(selectedBooking?.payment_total || 0)
                            }}</span
                          >
                        </div>

                        <!-- Amount Paid -->
                        <div
                          class="flex justify-between items-center py-2 text-green-600"
                        >
                          <span class="font-medium">Amount Paid</span>
                          <span class="font-medium"
                            >RM
                            {{
                              formatNumber(selectedBooking?.payment_amount || 0)
                            }}</span
                          >
                        </div>

                        <!-- Balance Due -->
                        <div
                          v-if="selectedBooking?.status === 2"
                          class="flex justify-between items-center py-2 text-amber-600 border-t border-gray-100"
                        >
                          <span class="font-medium">Balance Due</span>
                          <span class="font-medium"
                            >RM
                            {{
                              formatNumber(
                                (selectedBooking?.payment_total || 0) -
                                  (selectedBooking?.payment_amount || 0)
                              )
                            }}</span
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Footer Note -->
                    <div
                      class="text-center space-y-2 border-t border-gray-100 pt-6"
                    >
                      <p class="text-sm text-gray-500">
                        Thank you for your business!
                      </p>
                      <p class="text-xs text-gray-400">
                        This is a computer-generated receipt and requires no
                        signature.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div
                  class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row justify-end gap-2"
                >
                  <button
                    class="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    @click="receiptModalVisible = false"
                  >
                    Close
                  </button>
                  <button
                    class="w-full sm:w-auto px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm inline-flex items-center justify-center gap-2"
                    @click="downloadReceipt"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                      ></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download PDF
                  </button>
                </div>
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

  <Teleport to="body">
    <div
      v-if="activeStatusType && activeBookingId"
      class="fixed z-[9999] w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
      :style="{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
      }"
    >
      <div class="py-1" role="menu">
        <template v-if="activeStatusType === 'payment'">
          <button
            v-for="option in paymentStatusOptions"
            :key="option.value"
            class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
            @click="updatePaymentStatus($event, activeBookingId, option.value)"
          >
            {{ option.label }}
          </button>
        </template>
        <template v-else-if="activeStatusType === 'session'">
          <button
            v-for="option in sessionStatusOptions"
            :key="option.value"
            class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
            @click="updateSessionStatus($event, activeBookingId, option.value)"
          >
            {{ option.label }}
          </button>
        </template>
        <template v-else-if="activeStatusType === 'frame'">
          <button
            v-for="option in frameStatusOptions"
            :key="option.value"
            class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
            @click="updateFrameStatus($event, activeBookingId, option.value)"
          >
            {{ option.label }}
          </button>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEventListener } from "@vueuse/core";
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import StatusModal from "~/components/common/StatusModal.vue";

interface TimeSlot {
  slot: string;
  value: string;
}

type ModalStatus = "success" | "error";

// Add function to handle WhatsApp reminders
async function sendPaymentReminder() {
  if (!selectedBooking.value) return;

  try {
    const response = await $apiFetch("/api/whatsapp/reminder", {
      method: "POST",
      body: {
        bookingId: selectedBooking.value.id,
      },
    });

    console.log("Response", response);

    moreActionsVisible.value = false;

    showSuccessFailedModal(
      "success",
      "Reminder sent successfully",
      "Reminder of balance payment due has been sent to user"
    );
  } catch (error) {
    showSuccessFailedModal(
      "error",
      "Failed to send reminder",
      "Unable to send reminder of balance payment due to user"
    );
  }
}

// Add modal state
const modalState = ref({
  isOpen: false,
  status: "success" as ModalStatus,
  title: "",
  message: "",
});

function closeModal() {
  modalState.value.isOpen = false;
}

interface Booking {
  id: number;
  user_fullname: string;
  user_email: string;
  user_phoneno: string;
  user_source?: string;
  session_date: string;
  session_time: string;
  status: number;
  session_status: number;
  frame_status: number;
  frame_quantity?: number;
  payment_amount?: number;
  payment_total?: number;
  payment_date?: string;
  payment_ref_number?: string;
  chip_purchase_id?: string;
  theme_title?: string;
  theme_price?: number;
  payment_extra_pax?: number;
  payment_addon_total?: number;
  number_of_pax?: number;
  number_of_extra_pax?: number;
  addons?: Array<{
    title: string;
    qty: number;
    price: number;
  }>;
  created_at: string;
  referral_code?: string;
  calendar_event_id?: string;
}

type BookingResponse = Booking;

// Page Meta
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { $apiFetch } = useNuxtApp();

// State
const loading = ref(false);
const bookings = ref<Booking[]>([]);
const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const moreActionsVisible = ref(false);
const selectedBooking = ref<Booking | null>(null);
const rescheduleDate = ref("");
const rescheduleTime = ref("");
const isRescheduling = ref(false);
const rescheduleModalVisible = ref(false);
const loadingSlots = ref(false);
const availableTimeSlots = ref<TimeSlot[]>([]);
const selectedTimeSlot = ref<TimeSlot | null>(null);
const receiptModalVisible = ref(false);
const isFiltersVisible = ref(true);
const cancelConfirmationVisible = ref(false);
const activeDropdown = ref<number | null>(null);
const changeDateModalVisible = ref(false);
const cancelModalVisible = ref(false);
const newDate = ref("");
const newTimeSlot = ref("");
const isUpdating = ref(false);
const isCancelling = ref(false);

const logo = ref("");
const isLogoLoading = ref(true);
const isLoading = ref(false);

// Add these refs at the top with other refs
const activeStatusType = ref<"payment" | "session" | "frame" | null>(null);
const activeBookingId = ref<number | null>(null);
const dropdownPosition = ref({ top: 0, left: 0 });

const getConfig = async () => {
  try {
    const response = await $fetch("/api/booking/get-config");
    logo.value = response.logo;
  } finally {
    isLogoLoading.value = false;
  }
};
const filters = ref({
  paymentStatus: null as number | null,
  sessionStatus: null as number | null,
  startDate: "",
  endDate: "",
});

const sortBy = ref<{
  prop: keyof Booking;
  order: "ascending" | "descending";
}>({
  prop: "id",
  order: "descending",
});

// Options
const paymentStatusOptions = [
  { value: 1, label: "Pending" },
  { value: 2, label: "Partial" },
  { value: 3, label: "Paid" },
  { value: 4, label: "Failed" },
] as const;

const sessionStatusOptions = [
  { value: 1, label: "Pending" },
  { value: 2, label: "Completed" },
  { value: 3, label: "Cancelled" },
] as const;

const frameStatusOptions = [
  { value: 1, label: "Unprinted" },
  { value: 2, label: "Printed" },
  { value: 3, label: "Delivered" },
] as const;

// Computed
const stats = computed(() => {
  return {
    confirmed: bookings.value.filter((b) => b.status === 3).length,
    partiallyPaid: bookings.value.filter((b) => b.status === 2).length,
    totalFrames: bookings.value.reduce(
      (acc: number, b) => acc + (b.frame_quantity || 0),
      0
    ),
    totalSales: bookings.value
      .filter(
        (b) =>
          // Only include bookings that:
          // 1. Have status 2 (partial) or 3 (paid) - excluding 1 (pending) and 4 (failed)
          // 2. Session is not cancelled (status != 3)
          (b.status === 2 || b.status === 3) && b.session_status !== 3
      )
      .reduce((acc: number, b) => acc + (b.payment_amount || 0), 0),
  };
});

const filteredBookings = computed(() => {
  let result = [...bookings.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (booking) =>
        booking.user_fullname.toLowerCase().includes(query) ||
        booking.user_email.toLowerCase().includes(query) ||
        booking.user_phoneno.includes(query) ||
        (booking.payment_ref_number || "").toLowerCase().includes(query)
    );
  }

  // Date range filter
  if (filters.value.startDate) {
    result = result.filter(
      (booking) => booking.session_date >= filters.value.startDate
    );
  }
  if (filters.value.endDate) {
    result = result.filter(
      (booking) => booking.session_date <= filters.value.endDate
    );
  }

  // Status filters
  if (filters.value.paymentStatus !== null) {
    result = result.filter(
      (booking) => booking.status === filters.value.paymentStatus
    );
  }
  if (filters.value.sessionStatus !== null) {
    result = result.filter(
      (booking) => booking.session_status === filters.value.sessionStatus
    );
  }

  // Sorting
  if (sortBy.value.prop) {
    result.sort((a, b) => {
      const aVal = a[sortBy.value.prop] ?? "";
      const bVal = b[sortBy.value.prop] ?? "";
      if (sortBy.value.order === "ascending") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }

  return result;
});

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredBookings.value.slice(start, end);
});

function showSuccessFailedModal(
  status: ModalStatus,
  title: string,
  message: string
) {
  modalState.value = {
    isOpen: true,
    status,
    title,
    message,
  };
}

// Methods
function formatNumber(value: number) {
  return value.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date?: string) {
  if (!date) return "-";
  return dayjs(date).format("DD MMM YYYY");
}

function formatTime(time?: string) {
  if (!time) return "-";

  try {
    // First normalize the time string
    let timeString = time;

    // If time is in HH:mm:ss format, convert to HH:mm format
    if (time.includes(":")) {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);

      // Create date object using a fixed date
      const date = new Date(2000, 0, 1, hour, minute);

      // Format to 12-hour time with AM/PM
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return time; // Return original if parsing fails
  } catch (error) {
    console.error("Error formatting time:", error);
    return time; // Return original time if parsing fails
  }
}

function getPaymentStatusLabel(status: number) {
  return (
    paymentStatusOptions.find((opt) => opt.value === status)?.label || "Unknown"
  );
}

function getSessionStatusLabel(status: number) {
  return (
    sessionStatusOptions.find((opt) => opt.value === status)?.label || "Unknown"
  );
}

function getFrameStatusLabel(status: number) {
  return (
    frameStatusOptions.find((opt) => opt.value === status)?.label || "Unknown"
  );
}

function handleSearch() {
  currentPage.value = 1;
}

function handleFiltersChange() {
  currentPage.value = 1;
}

function handleSortChange({
  prop,
  order,
}: {
  prop: keyof Booking;
  order: "ascending" | "descending";
}) {
  sortBy.value = { prop, order };
}

function resetFilters() {
  searchQuery.value = "";
  filters.value.paymentStatus = null;
  filters.value.sessionStatus = null;
  filters.value.startDate = "";
  filters.value.endDate = "";
  currentPage.value = 1;
}

function exportToCSV() {
  const headers = [
    "No",
    "Reference No",
    "Customer Name",
    "Email",
    "Phone",
    "Theme",
    "Referral",
    "Session Date",
    "Session Time",
    "Payment Status",
    "Session Status",
    "Frame Status",
    "Total Payment",
  ];

  const csvContent = [
    headers.join(","),
    ...filteredBookings.value.map((booking) =>
      [
        booking.id,
        `"${booking.ref_number}"`,
        `"${booking.user_fullname}"`,
        `"${booking.user_email}"`,
        `"${booking.user_phoneno}"`,
        booking.theme_title,
        booking.referral_code || "-",
        booking.session_date,
        booking.session_time,
        getPaymentStatusLabel(booking.status),
        getSessionStatusLabel(booking.session_status),
        getFrameStatusLabel(booking.frame_status),
        booking.payment_amount,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `bookings_${dayjs().format("YYYY-MM-DD")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function updatePaymentStatus(
  event: Event,
  bookingId: number,
  status: number
) {
  try {
    await $apiFetch("/api/booking/update-payment-status", {
      method: "POST",
      body: {
        bookingId,
        status,
      },
    });
    await fetchBookings();

    // Close dropdown after update
    activeStatusType.value = null;
    activeBookingId.value = null;
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    loading.value = false;
  }
}

async function downloadReceipt() {
  const element = document.getElementById("receipt-content");
  if (!element) return;

  try {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`receipt_${selectedBooking.value?.id}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

const minDate = computed(() => {
  return dayjs().format("YYYY-MM-DD");
});

// Methods for change date functionality
function openChangeDateModal() {
  // Format the session_date to YYYY-MM-DD in local timezone
  const formattedDate = selectedBooking.value?.session_date
    ? dayjs(selectedBooking.value.session_date).format("YYYY-MM-DD")
    : "";

  newDate.value = formattedDate;
  newTimeSlot.value = selectedBooking.value?.session_time || "";

  moreActionsVisible.value = false;
  changeDateModalVisible.value = true;

  // If we have a date, fetch the time slots immediately
  if (formattedDate) {
    handleDateChange();
  }
}

async function handleDateChange() {
  if (!newDate.value) return;

  newTimeSlot.value = "";
  loadingSlots.value = true;

  try {
    interface ApiResponse {
      data: TimeSlot[];
    }

    const response = await $apiFetch<ApiResponse>(
      `/api/booking/get-available-slots?date=${newDate.value}&theme_id=${selectedBooking.value?.theme_id}`
    );

    if (response && "data" in response) {
      availableTimeSlots.value = response.data;
    } else {
      availableTimeSlots.value = [];
    }
  } catch (error) {
    console.error("Error fetching time slots:", error);
    availableTimeSlots.value = [];
  } finally {
    loadingSlots.value = false;
  }
}

async function confirmChangeDateTime() {
  if (!selectedBooking.value || !newDate.value || !newTimeSlot.value) return;

  isUpdating.value = true;

  try {
    await $apiFetch("/api/booking/reschedule", {
      method: "POST",
      body: {
        bookingId: selectedBooking.value.id,
        session_date: newDate.value,
        session_time: newTimeSlot.value,
      },
    });

    // Success modal
    showSuccessFailedModal(
      "success",
      "Success",
      "Booking has been rescheduled successfully"
    );

    // Close modals and refresh data
    changeDateModalVisible.value = false;
    moreActionsVisible.value = false;
    await fetchBookings();
  } catch (error) {
    console.error("Error updating booking datetime:", error);
  } finally {
    isUpdating.value = false;
  }
}

// Methods for cancel booking functionality
function openCancelModal() {
  cancelModalVisible.value = true;
  moreActionsVisible.value = false;
}

async function confirmCancelBooking() {
  if (!selectedBooking.value) return;

  isCancelling.value = true;

  try {
    await $apiFetch("/api/booking/update-session-status", {
      method: "POST",
      body: {
        bookingId: selectedBooking.value.id,
        status: 3,
      },
    });

    // Show success modal
    showSuccessFailedModal(
      "success",
      "Success",
      "Booking has been cancelled successfully"
    );

    // Close modal and refresh data
    cancelModalVisible.value = false;
    await fetchBookings();
  } catch (error) {
    console.error("Error cancelling booking:", error);
  } finally {
    isCancelling.value = false;
  }
}

async function addToCalendar() {
  if (!selectedBooking.value) return;

  try {
    await $apiFetch("/api/calendar/create-event", {
      method: "POST",
      body: { bookingId: selectedBooking.value.id },
    });

    moreActionsVisible.value = false;

    // Show success modal
    showSuccessFailedModal(
      "success",
      "Success",
      "Event has been added to calendar successfully"
    );

    // Refresh bookings data
    await fetchBookings();
  } catch (error) {
    console.error("Error adding to calendar:", error);
    moreActionsVisible.value = false;

    showSuccessFailedModal(
      "error",
      "Failed",
      "Unable to add event to calendar"
    );
  } finally {
  }
}

async function removeFromCalendar() {
  if (!selectedBooking.value) return;

  try {
    await $apiFetch("/api/calendar/delete-event", {
      method: "POST",
      body: { bookingId: selectedBooking.value.id },
    });

    moreActionsVisible.value = false;

    // Show success modal
    showSuccessFailedModal(
      "success",
      "Success",
      "Event has been removed from calendar successfully"
    );

    // Refresh bookings data
    await fetchBookings();
  } catch (error) {
    console.error("Error removing from calendar:", error);

    moreActionsVisible.value = false;

    showSuccessFailedModal(
      "error",
      "Failed",
      "Unable to remove event from calendar"
    );
  } finally {
  }
}

// Add back the missing functions
function openStatusDropdown(event: Event, booking: Booking, type: 'payment' | 'session' | 'frame') {
  event.stopPropagation();
  
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  
  // Position the dropdown below the trigger
  dropdownPosition.value = {
    top: rect.bottom + window.scrollY + 4,
    left: rect.left + window.scrollX
  };
  
  activeStatusType.value = type;
  activeBookingId.value = booking.id;
}

function openMoreActionsModal(booking: Booking) {
  selectedBooking.value = { ...booking };
  moreActionsVisible.value = true;
}

function openReceiptModal(booking: Booking) {
  selectedBooking.value = { ...booking };
  receiptModalVisible.value = true;
}

// Add this function for pagination page numbers
function getPageNumbers() {
  const pages = [];
  const maxVisiblePages = 5;
  const totalPages = Math.ceil(filteredBookings.value.length / pageSize.value);

  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let end = Math.min(totalPages, start + maxVisiblePages - 1);

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}

// Handle click outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (
    !target.closest('.status-trigger') &&
    activeStatusType.value !== null
  ) {
    activeStatusType.value = null;
    activeBookingId.value = null;
  }
}

// Setup event listeners
onMounted(() => {
  fetchBookings();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Initial fetch
onMounted(() => {
  getConfig();
  fetchBookings();
});

async function fetchBookings() {
  loading.value = true;
  try {
    const response = (await $apiFetch(
      "/api/booking/get-bookings"
    )) as BookingResponse[];

    if (response) {
      bookings.value = response.map((booking) => ({
        ...booking,
        frame_quantity: booking.frame_quantity || 0,
      }));
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    loading.value = false;
  }
}

async function updateSessionStatus(event: Event, bookingId: number, status: number) {
  try {
    await $apiFetch("/api/booking/update-session-status", {
      method: "POST",
      body: {
        bookingId,
        status,
      },
    });
    await fetchBookings();
    
    // Close dropdown after update
    activeStatusType.value = null;
    activeBookingId.value = null;
  } catch (error) {
    console.error("Error updating session status:", error);
  }
}

async function updateFrameStatus(event: Event, bookingId: number, status: number) {
  try {
    await $apiFetch("/api/booking/update-frame-status", {
      method: "POST",
      body: {
        bookingId,
        status,
      },
    });
    await fetchBookings();
    
    // Close dropdown after update
    activeStatusType.value = null;
    activeBookingId.value = null;
  } catch (error) {
    console.error("Error updating frame status:", error);
  }
}
</script>

<style lang="scss" scoped>
.status-dropdown {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: top;
  opacity: 0;
  pointer-events: none;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: calc(100vh - 300px); // Prevent dropdown from being too long
  overflow-y: auto; // Add scrolling if needed

  &:not(.hidden) {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  &.hidden {
    transform: translateY(-4px);
  }

  /* Ensure dropdown content is opaque */
  > div {
    background-color: white;
    border-radius: 0.5rem;
  }

  /* Style the buttons */
  button {
    background-color: white;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;

    &:hover {
      background-color: #f9fafb;
    }
  }
}

// Ensure the table cells have proper positioning context
.relative {
  isolation: isolate;
}

// Add styles for table footer
.table-footer {
  position: relative;
  z-index: 49; // Lower than dropdown but higher than table content
}
</style>
