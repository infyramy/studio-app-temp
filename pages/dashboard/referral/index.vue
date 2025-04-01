<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Header Section -->
    <div class="">
      <h1 class="text-xl xs:text-2xl font-bold text-gray-900">
        Referral Management
      </h1>
      <p class="mt-0.5 text-xs sm:text-sm text-gray-500">
        Track and manage your sales member referrals
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-3 sm:gap-4">
      <div
        class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-3 sm:p-4">
          <div class="flex flex-col min-w-0">
            <span
              class="text-[10px] xs:text-xs sm:text-sm font-medium text-blue-600 truncate"
              >Total Referrals</span
            >
            <span
              class="mt-0.5 sm:mt-1 lg:mt-2 text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 truncate"
              >{{ totalReferrals }}</span
            >
            <p
              class="mt-1 text-[10px] xs:text-xs sm:text-sm text-blue-600 line-clamp-2"
            >
              Active referral codes
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-100">
      <div class="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h2
              class="text-sm xs:text-base sm:text-lg font-medium text-gray-900"
            >
              Referral List
            </h2>
            <p class="mt-0.5 text-[10px] xs:text-xs sm:text-sm text-gray-500">
              Manage your sales member referrals
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search referrals..."
                class="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div
                v-if="isSearching"
                class="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"
                ></div>
              </div>
            </div>
            <button
              @click="openAddReferralModal"
              class="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 border border-transparent shadow-sm text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors duration-200"
            >
              Add New Referral
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="mt-4 flex flex-col sm:flex-row gap-4">
          <div class="flex items-center gap-2">
            <select
              v-model="filters.status"
              class="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

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
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  No
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Referral Code
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Member Name
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Booking
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr
                v-for="(referral, index) in tableReferrals"
                :key="referral.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ referral.index }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{
                    referral.code
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{
                    referral.memberName
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{
                    referral.totalBookings
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                      referral.status == 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{ referral.status == 1 ? "Active" : "Inactive" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click="copyReferralUrl(referral.code)"
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                      title="Copy Referral URL"
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
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path
                          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        ></path>
                      </svg>
                    </button>
                    <button
                      @click="openBookingListModal(referral)"
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                      title="View Bookings"
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
                        <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                    <button
                      @click="openEditReferralModal(referral)"
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                      title="Edit Referral"
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
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="tableReferrals.length === 0">
                <td
                  colspan="6"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No referrals found
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Mobile View -->
          <div class="sm:hidden">
            <div
              v-for="(referral, index) in tableReferrals"
              :key="referral.id"
              class="p-4 border-b border-gray-100"
            >
              <div class="space-y-3">
                <div class="flex justify-between items-start">
                  <div class="space-y-1">
                    <div class="font-medium text-gray-900">
                      {{ referral.memberName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      Code: {{ referral.code }}
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <span
                        :class="[
                          'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                          referral.totalBookings > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800',
                        ]"
                      >
                        {{ referral.totalBookings > 0 ? "Active" : "Inactive" }}
                      </span>
                      <span class="text-sm text-gray-500">
                        Total Bookings: {{ referral.totalBookings }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="copyReferralUrl(referral.code)"
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="Copy Referral URL"
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
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path
                          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        ></path>
                      </svg>
                    </button>
                    <button
                      @click="openBookingListModal(referral)"
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
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
                        <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                    <button
                      @click="openEditReferralModal(referral)"
                      class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="Edit Referral"
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
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="tableReferrals.length === 0"
              class="p-4 text-center text-sm text-gray-500"
            >
              No referrals found
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Referral Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="isAddModalOpen" as="template">
        <Dialog
          as="div"
          @close="closeAddReferralModal"
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
            ></div>
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
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
                >
                  <!-- Modal Header -->
                  <div
                    class="border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4"
                  >
                    <div class="flex items-center justify-between">
                      <DialogTitle
                        as="h3"
                        class="text-lg font-medium text-gray-900"
                      >
                        Add New Referral
                      </DialogTitle>
                      <button
                        type="button"
                        class="text-gray-400 hover:text-gray-500"
                        @click="closeAddReferralModal"
                      >
                        <span class="sr-only">Close</span>
                        <svg
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <form @submit.prevent="handleAddReferral">
                    <!-- Modal Content -->
                    <div class="p-4 sm:p-6 space-y-4">
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700"
                          >Member Name</label
                        >
                        <input
                          v-model="newReferral.memberName"
                          type="text"
                          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700"
                          >Referral Code</label
                        >
                        <input
                          v-model="newReferral.code"
                          type="text"
                          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <!-- Modal Footer -->
                    <div
                      class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row justify-end gap-2"
                    >
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        @click="closeAddReferralModal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        :disabled="isSubmitting"
                      >
                        {{ isSubmitting ? "Adding..." : "Add Referral" }}
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

    <!-- Booking List Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="isBookingListModalOpen" as="template">
        <Dialog
          as="div"
          @close="closeBookingListModal"
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
            ></div>
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
                  class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
                >
                  <!-- Modal Header -->
                  <div
                    class="border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4"
                  >
                    <div class="flex items-center justify-between">
                      <DialogTitle
                        as="h3"
                        class="text-lg font-medium text-gray-900"
                      >
                        Booking List for {{ selectedReferral?.memberName }}
                      </DialogTitle>
                      <button
                        type="button"
                        class="text-gray-400 hover:text-gray-500"
                        @click="closeBookingListModal"
                      >
                        <span class="sr-only">Close</span>
                        <svg
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Modal Content -->
                  <div class="p-4 sm:p-6">
                    <div class="overflow-x-auto">
                      <table class="w-full">
                        <thead class="bg-gray-50">
                          <tr>
                            <th
                              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                            >
                              Booking ID
                            </th>
                            <th
                              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                            >
                              Customer
                            </th>
                            <th
                              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                            >
                              Date
                            </th>
                            <th
                              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                          <tr
                            v-for="booking in selectedReferralBookings"
                            :key="booking.id"
                            class="hover:bg-gray-50"
                          >
                            <td class="px-4 py-2 text-sm text-gray-900">
                              {{ booking.id }}
                            </td>
                            <td class="px-4 py-2 text-sm text-gray-900">
                              {{ booking.customerName }}
                            </td>
                            <td class="px-4 py-2 text-sm text-gray-900">
                              {{ formatDate(booking.date) }}
                            </td>
                            <td class="px-4 py-2">
                              <span
                                :class="getStatusClass(booking.status)"
                                class="text-sm"
                              >
                                {{
                                  booking.status == 1
                                    ? "Pending"
                                    : booking.status == 2
                                    ? "Completed"
                                    : "Cancelled"
                                }}
                              </span>
                            </td>
                          </tr>
                          <tr v-if="selectedReferralBookings.length === 0">
                            <td
                              colspan="4"
                              class="px-4 py-2 text-center text-sm text-gray-500"
                            >
                              No bookings found
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>

    <!-- Edit Referral Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="isEditModalOpen" as="template">
        <Dialog
          as="div"
          @close="closeEditReferralModal"
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
            ></div>
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
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
                >
                  <!-- Modal Header -->
                  <div
                    class="border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4"
                  >
                    <div class="flex items-center justify-between">
                      <DialogTitle
                        as="h3"
                        class="text-lg font-medium text-gray-900"
                      >
                        Edit Referral
                      </DialogTitle>
                      <button
                        type="button"
                        class="text-gray-400 hover:text-gray-500"
                        @click="closeEditReferralModal"
                      >
                        <span class="sr-only">Close</span>
                        <svg
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <form @submit.prevent="handleEditReferral">
                    <!-- Modal Content -->
                    <div class="p-4 sm:p-6 space-y-4">
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700"
                          >Member Name</label
                        >
                        <input
                          v-model="editReferral.memberName"
                          type="text"
                          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700"
                          >Referral Code</label
                        >
                        <input
                          v-model="editReferral.code"
                          type="text"
                          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700"
                          >Status</label
                        >
                        <select
                          v-model="editReferral.status"
                          class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="1">Active</option>
                          <option value="2">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <!-- Modal Footer -->
                    <div
                      class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row justify-end gap-2"
                    >
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        @click="closeEditReferralModal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        :disabled="isSubmitting"
                      >
                        {{ isSubmitting ? "Updating..." : "Update Referral" }}
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
  </div>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useClipboard } from "@vueuse/core";

definePageMeta({
  layout: "dashboard",
});

const { $apiFetch } = useNuxtApp();

interface ApiResponse<T> {
  statusCode: number;
  status: string;
  data?: T;
  message?: string;
}

interface Booking {
  id: string;
  customerName: string;
  date: string;
  status: number;
}

interface Referral {
  id: string;
  code: string;
  memberName: string;
  totalBookings: number;
  bookings: Booking[];
  status: number;
  index?: number;
}

interface Filters {
  status: string;
}

// Type the $apiFetch function
type ApiFetch = <T>(url: string, options?: any) => Promise<T>;
const apiFetch = $apiFetch as ApiFetch;

const { copy } = useClipboard();

const loading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref("");
const isSearching = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalReferrals = ref(0);
const referrals = ref<Referral[]>([]);
const isAddModalOpen = ref(false);
const isBookingListModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedReferral = ref<Referral | null>(null);
const selectedReferralBookings = ref<Booking[]>([]);
const editReferral = ref<Referral>({
  id: "",
  code: "",
  memberName: "",
  totalBookings: 0,
  bookings: [],
  status: 1,
});

const filters = ref<Filters>({
  status: "all",
});

const newReferral = ref({
  memberName: "",
  code: "",
});

// Computed properties for table data
const filteredReferrals = computed(() => {
  let result = [...referrals.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (referral) =>
        referral.memberName.toLowerCase().includes(query) ||
        referral.code.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filters.value.status !== "all") {
    result = result.filter((referral) => {
      if (filters.value.status === "active") {
        return referral.totalBookings > 0;
      }
      return referral.totalBookings === 0;
    });
  }

  return result;
});

const paginatedReferrals = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredReferrals.value.slice(start, end);
});

const tableReferrals = computed(() => {
  return paginatedReferrals.value.map((referral, index) => ({
    ...referral,
    index: (currentPage.value - 1) * pageSize.value + index + 1,
  }));
});

const totalItems = computed(() => filteredReferrals.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const paginationStart = computed(
  () => (currentPage.value - 1) * pageSize.value + 1
);
const paginationEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, totalItems.value)
);

// Watchers
watch(searchQuery, (newValue) => {
  isSearching.value = true;
  currentPage.value = 1;

  // Debounce search
  const timeoutId = setTimeout(() => {
    isSearching.value = false;
  }, 300);

  onBeforeUnmount(() => {
    clearTimeout(timeoutId);
  });
});

watch([filters, pageSize], () => {
  currentPage.value = 1;
});

// Modal handlers
function openAddReferralModal() {
  isAddModalOpen.value = true;
}

function closeAddReferralModal() {
  isAddModalOpen.value = false;
  newReferral.value = { memberName: "", code: "" };
}

function openBookingListModal(referral: Referral) {
  selectedReferral.value = referral;
  selectedReferralBookings.value = referral.bookings;
  isBookingListModalOpen.value = true;
}

function closeBookingListModal() {
  isBookingListModalOpen.value = false;
  selectedReferral.value = null;
  selectedReferralBookings.value = [];
}

function openEditReferralModal(referral: Referral) {
  editReferral.value = { ...referral };
  isEditModalOpen.value = true;
}

function closeEditReferralModal() {
  isEditModalOpen.value = false;
  editReferral.value = {
    id: "",
    code: "",
    memberName: "",
    totalBookings: 0,
    bookings: [],
    status: 1,
  };
}

// Form handlers
async function handleAddReferral() {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call to add new referral
    const response = await apiFetch("/api/organization/create-referral", {
      method: "POST",
      body: {
        referral: newReferral.value.code,
        member: newReferral.value.memberName,
      },
    });

    console.log("response: ", response);

    closeAddReferralModal();
    // Refresh referral list
    await fetchReferrals();
  } catch (error) {
    console.error("Failed to add referral:", error);
  } finally {
    isSubmitting.value = false;
  }
}

async function handleEditReferral() {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call to update referral
    const response = await apiFetch(
      `/api/organization/update-referral/${editReferral.value.id}`,
      {
        method: "PUT",
        body: {
          referral: editReferral.value.code,
          member: editReferral.value.memberName,
          status: editReferral.value.status,
        },
      }
    );

    console.log("response: ", response);

    closeEditReferralModal();
    // Refresh referral list
    await fetchReferrals();
  } catch (error) {
    console.error("Failed to update referral:", error);
  } finally {
    isSubmitting.value = false;
  }
}

// Utility functions
function formatDate(date: string): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusClass(status: number): string {
  const statusMap: Record<number, string> = {
    2: "bg-green-100 text-green-800",
    1: "bg-yellow-100 text-yellow-800",
    3: "bg-red-100 text-red-800",
  };
  return `px-2 py-1 rounded-full text-xs font-medium ${
    statusMap[status] || "bg-gray-100 text-gray-800"
  }`;
}

// Data fetching
async function fetchReferrals() {
  loading.value = true;
  try {
    const response = await apiFetch<ApiResponse<Referral[]>>(
      "/api/organization/get-referral"
    );
    console.log("response: ", response);

    if (response.data) {
      referrals.value = response.data;
      totalReferrals.value = referrals.value.length;
    }
  } catch (error) {
    console.error("Failed to fetch referrals:", error);
  } finally {
    loading.value = false;
  }
}

// Add this function for copying referral URL
async function copyReferralUrl(referralCode: string) {
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl || window.location.origin;
  const fullUrl = `${baseUrl}?ref=${referralCode}`;

  try {
    await copy(fullUrl);
    alert("Referral URL copied to clipboard!");
  } catch (error) {
    alert("Failed to copy URL");
  }
}

// Initial data fetch
onMounted(() => {
  fetchReferrals();
});
</script>

<style lang="scss" scoped></style>
