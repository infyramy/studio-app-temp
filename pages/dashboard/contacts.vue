<script setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';

definePageMeta({
  layout: "dashboard",
});

const { $apiFetch } = useNuxtApp();

// Contact data
const contacts = ref([]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const pageSizeOptions = [5, 10, 25, 50];

// Search and filter states
const search = ref("");
const debouncedSearch = ref("");
const showFilters = ref(false);
const isSearching = ref(false);
let searchDebounceTimeout = null;

// Debounce search input
watch(search, async (newValue) => {
  isSearching.value = true;
  if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    debouncedSearch.value = newValue;
    isSearching.value = false;
  }, 300);
});

// Enhanced filtered contacts computation
const filteredContacts = computed(() => {
  return contacts.value.filter((contact) => {
    // Search match with debouncing
    const searchMatch =
      !debouncedSearch.value ||
      (contact.name?.toLowerCase() || "").includes(
        debouncedSearch.value.toLowerCase()
      ) ||
      (contact.email?.toLowerCase() || "").includes(
        debouncedSearch.value.toLowerCase()
      ) ||
      (contact.phone || "").includes(debouncedSearch.value);

    return searchMatch;
  });
});

// Pagination computed properties
const totalPages = computed(() =>
  Math.ceil(filteredContacts.value.length / itemsPerPage.value)
);

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredContacts.value.slice(start, end);
});

// Add pagination functions
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getPageNumbers = () => {
  const pages = [];
  const maxVisiblePages = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1);

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};

// Format functions
function formatNumber(value) {
  return Number(value).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Add export functionality
const exportToCSV = () => {
  // Define CSV headers
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Total Bookings",
    "Paid Bookings",
    "Pending Bookings",
    "First Booking",
    "Themes",
  ].join(",");

  // Convert contacts to CSV rows
  const rows = filteredContacts.value.map((contact) =>
    [
      contact.name,
      contact.email,
      contact.phone,
      contact.total_bookings,
      contact.paid_bookings,
      contact.pending_bookings,
      formatDate(contact.first_booking),
      contact.themes,
    ]
      .map((field) => `"${field || ""}"`)
      .join(",")
  );

  // Combine headers and rows
  const csv = [headers, ...rows].join("\n");

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `contacts-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Loading states
const isLoading = ref(false);

const getContacts = async () => {
  isLoading.value = true;
  try {
    const resp = await $apiFetch("/api/contact/get-contacts");
    // console.log("Response Contacts", resp);
    contacts.value = resp;
  } catch (error) {
    console.error("Error fetching contacts:", error);
  } finally {
    isLoading.value = false;
  }
};

// Reset filters
const resetFilters = () => {
  search.value = "";
  debouncedSearch.value = "";
  currentPage.value = 1;
};

onMounted(() => {
  getContacts();
});

// Modal states
const showDetailsModal = ref(false);
const selectedContact = ref(null);

const openDetailsModal = (contact) => {
  selectedContact.value = contact;
  showDetailsModal.value = true;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col">
      <h1 class="text-2xl font-bold">Contacts</h1>
      <span class="text-md">View all your contacts here</span>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6">
      <!-- Total Contacts Card -->
      <div
        class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-blue-600"
                >Total Contacts</span
              >
              <span class="mt-2 text-3xl font-bold text-blue-900">{{
                contacts.length
              }}</span>
            </div>
            <div class="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
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
              v-model="search"
              type="text"
              placeholder="Search by name, email, or phone..."
              class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
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
              class="w-5 h-5"
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
            <span class="hidden sm:inline">Export to CSV</span>
            <span class="sm:hidden">Export</span>
          </button>
        </div>

        <!-- Bottom Row: Filters -->
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100"
        >
          <span class="text-sm font-medium text-gray-500">Filters:</span>

          <!-- Date Range -->
          <div
            class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1"
          >
            <div class="relative flex-1">
              <input
                type="date"
                class="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
            <span class="text-sm text-gray-400 hidden sm:inline">to</span>
            <div class="relative flex-1">
              <input
                type="date"
                class="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
          </div>

          <div class="hidden sm:block h-5 w-px bg-gray-200"></div>

          <!-- Reset Button -->
          <button
            class="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
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

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <div v-if="isLoading" class="flex justify-center items-center p-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
          ></div>
        </div>

        <!-- Desktop Table View -->
        <table
          v-else
          class="min-w-full divide-y divide-gray-100 hidden sm:table"
        >
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="header in ['No', 'Contact Info', 'Bookings', 'Actions']"
                :key="header"
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors duration-200"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="(contact, index) in paginatedContacts"
              :key="contact.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 flex-shrink-0 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center"
                  >
                    <span class="text-sm font-medium text-blue-700">
                      {{ contact.name.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ contact.name }}
                    </div>
                    <div class="text-sm text-gray-500">{{ contact.email }}</div>
                    <div class="text-sm text-gray-500">{{ contact.phone }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-900"
                      >Booking Summary</span
                    >
                    <span
                      class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                      :class="{
                        'bg-green-100 text-green-800':
                          contact.total_bookings > 0,
                        'bg-gray-100 text-gray-800':
                          contact.total_bookings === 0,
                      }"
                    >
                      {{ contact.total_bookings }} Total
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col space-y-1">
                      <div
                        class="flex items-center justify-between bg-green-50 rounded-md px-2 py-1"
                      >
                        <span class="text-xs text-green-700">Completed</span>
                        <span class="text-xs font-medium text-green-800">{{
                          contact.completed_session
                        }}</span>
                      </div>
                      <div
                        class="flex items-center justify-between bg-yellow-50 rounded-md px-2 py-1"
                      >
                        <span class="text-xs text-yellow-700">Pending</span>
                        <span class="text-xs font-medium text-yellow-800">{{
                          contact.pending_session
                        }}</span>
                      </div>
                      <div
                        class="flex items-center justify-between bg-red-50 rounded-md px-2 py-1"
                      >
                        <span class="text-xs text-red-700">Cancelled</span>
                        <span class="text-xs font-medium text-red-800">{{
                          contact.cancelled_session
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-if="contact.themes" class="flex flex-wrap gap-1">
                    <span
                      v-for="theme in contact.themes.split(',').slice(0, 2)"
                      :key="theme"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {{ theme }}
                    </span>
                    <span
                      v-if="contact.themes.split(',').length > 2"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      +{{ contact.themes.split(",").length - 2 }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <button
                    @click="openDetailsModal(contact)"
                    class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    title="View Details"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <a
                    :href="'mailto:' + contact.email"
                    class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    title="Send Email"
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                  <a
                    :href="'https://wa.me/' + contact.phone?.replace(/\D/g, '')"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    title="Send WhatsApp Message"
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
                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                      />
                    </svg>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Mobile List View -->
        <div class="sm:hidden divide-y divide-gray-100">
          <div
            v-for="(contact, index) in paginatedContacts"
            :key="contact.id"
            class="p-4 space-y-4 bg-white"
          >
            <!-- Contact Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 flex-shrink-0 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-blue-700">
                    {{ contact.name.charAt(0) }}
                  </span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ contact.name }}
                  </div>
                  <div class="text-xs text-gray-500">{{ contact.email }}</div>
                  <div class="text-xs text-gray-500">{{ contact.phone }}</div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="flex items-center gap-2">
                <button
                  @click="openDetailsModal(contact)"
                  class="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Booking Stats -->
            <div class="space-y-3 bg-gray-50 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-500"
                  >Total Bookings</span
                >
                <span
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': contact.total_bookings > 0,
                    'bg-gray-100 text-gray-800': contact.total_bookings === 0,
                  }"
                >
                  {{ contact.total_bookings }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1">
                  <div
                    class="flex items-center justify-between bg-green-50 rounded px-2 py-1"
                  >
                    <span class="text-xs text-green-700">Completed</span>
                    <span class="text-xs font-medium text-green-800">{{
                      contact.completed_session
                    }}</span>
                  </div>
                  <div
                    class="flex items-center justify-between bg-yellow-50 rounded px-2 py-1"
                  >
                    <span class="text-xs text-yellow-700">Pending</span>
                    <span class="text-xs font-medium text-yellow-800">{{
                      contact.pending_session
                    }}</span>
                  </div>
                  <div
                    class="flex items-center justify-between bg-red-50 rounded px-2 py-1"
                  >
                    <span class="text-xs text-red-700">Cancelled</span>
                    <span class="text-xs font-medium text-red-800">{{
                      contact.cancelled_session
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Themes -->
            <div v-if="contact.themes" class="flex flex-wrap gap-1">
              <span
                v-for="theme in contact.themes.split(',').slice(0, 2)"
                :key="theme"
                class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded"
              >
                {{ theme }}
              </span>
              <span
                v-if="contact.themes.split(',').length > 2"
                class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded"
              >
                +{{ contact.themes.split(",").length - 2 }}
              </span>
            </div>

            <!-- Contact Actions -->
            <div class="flex justify-end gap-2 pt-2">
              <a
                :href="'mailto:' + contact.email"
                class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                <svg
                  class="w-4 h-4 mr-1"
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
                Email
              </a>
              <a
                :href="'https://wa.me/' + contact.phone?.replace(/\D/g, '')"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                  />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Footer -->
      <div class="px-4 sm:px-6 py-4 border-t border-gray-100 bg-white">
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <!-- Entries Info -->
          <div
            class="flex items-center gap-4 text-sm text-gray-700 order-2 sm:order-1"
          >
            <span class="whitespace-nowrap">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{
                Math.min(currentPage * itemsPerPage, filteredContacts.length)
              }}
              of {{ filteredContacts.length }} entries
            </span>
            <select
              v-model="itemsPerPage"
              class="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="size in pageSizeOptions" :key="size" :value="size">
                {{ size }} / page
              </option>
            </select>
          </div>

          <!-- Pagination -->
          <div class="flex gap-2 order-1 sm:order-2">
            <button
              class="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="currentPage === 1"
              @click="handlePageChange(currentPage - 1)"
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
                @click="handlePageChange(page)"
              >
                {{ page }}
              </button>
            </div>
            <button
              class="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="currentPage === totalPages"
              @click="handlePageChange(currentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Details Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="showDetailsModal" as="template">
        <Dialog as="div" @close="showDetailsModal = false" class="relative z-[100]">
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
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          </TransitionChild>

          <!-- Modal Container -->
          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
                  <!-- Modal Header -->
                  <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
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
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900">Contact Details</h3>
                        <p class="text-sm text-gray-500">View detailed information about this contact</p>
                      </div>
                    </div>
                    <button
                      class="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      @click="showDetailsModal = false"
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
                  <div class="p-4 sm:p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
                    <!-- Contact Information -->
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <h4 class="text-sm font-medium text-gray-900">Contact Information</h4>
                        <span class="px-2.5 py-0.5 text-xs font-medium rounded-full"
                          :class="{
                            'bg-green-100 text-green-800': selectedContact?.total_bookings > 0,
                            'bg-gray-100 text-gray-800': selectedContact?.total_bookings === 0
                          }"
                        >
                          {{ selectedContact?.total_bookings }} Total Bookings
                        </span>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                        <div class="space-y-1">
                          <div class="text-sm text-gray-500">Full Name</div>
                          <div class="text-sm font-medium text-gray-900">{{ selectedContact?.name }}</div>
                        </div>
                        <div class="space-y-1">
                          <div class="text-sm text-gray-500">Email</div>
                          <div class="text-sm font-medium text-gray-900">{{ selectedContact?.email }}</div>
                        </div>
                        <div class="space-y-1">
                          <div class="text-sm text-gray-500">Phone</div>
                          <div class="text-sm font-medium text-gray-900">{{ selectedContact?.phone }}</div>
                        </div>
                        <div class="space-y-1">
                          <div class="text-sm text-gray-500">First Booking</div>
                          <div class="text-sm font-medium text-gray-900">{{ formatDate(selectedContact?.first_booking) }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Booking Statistics -->
                    <div class="space-y-4">
                      <h4 class="text-sm font-medium text-gray-900">Booking Statistics</h4>
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div class="bg-[#F5E6E0]/30 rounded-lg p-4">
                          <p class="text-xs text-gray-500 mb-1">Total Bookings</p>
                          <p class="text-2xl font-semibold text-[#3C2A21]">{{ selectedContact?.total_bookings }}</p>
                        </div>
                        <div class="bg-green-50 rounded-lg p-4">
                          <p class="text-xs text-gray-500 mb-1">Completed</p>
                          <p class="text-2xl font-semibold text-green-600">{{ selectedContact?.completed_session }}</p>
                        </div>
                        <div class="bg-yellow-50 rounded-lg p-4">
                          <p class="text-xs text-gray-500 mb-1">Pending</p>
                          <p class="text-2xl font-semibold text-yellow-600">{{ selectedContact?.pending_session }}</p>
                        </div>
                        <div class="bg-red-50 rounded-lg p-4">
                          <p class="text-xs text-gray-500 mb-1">Cancelled</p>
                          <p class="text-2xl font-semibold text-red-600">{{ selectedContact?.cancelled_session }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Themes Booked -->
                    <div class="space-y-4">
                      <h4 class="text-sm font-medium text-gray-900">Themes Booked</h4>
                      <div class="p-4 bg-gray-50 rounded-lg">
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="theme in selectedContact?.themes?.split(',')"
                            :key="theme"
                            class="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 border border-gray-200"
                          >
                            {{ theme }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Additional Information -->
                    <div class="space-y-4">
                      <h4 class="text-sm font-medium text-gray-900">Additional Information</h4>
                      <div class="p-4 bg-gray-50 rounded-lg">
                        <ul class="space-y-2 text-sm text-gray-600">
                          <li class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Latest booking: {{ formatDate(selectedContact?.latest_booking) }}</span>
                          </li>
                          <li class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Average session duration: 1 hour</span>
                          </li>
                          <li class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Preferred contact method: {{ selectedContact?.phone ? 'WhatsApp' : 'Email' }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- Modal Footer -->
                  <div class="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-white rounded-b-xl flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 flex-shrink-0">
                    <button
                      class="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm"
                      @click="showDetailsModal = false"
                    >
                      Close
                    </button>
                    <a
                      :href="'mailto:' + selectedContact?.email"
                      class="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm inline-flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </a>
                    <a
                      :href="'https://wa.me/' + selectedContact?.phone?.replace(/\D/g, '')"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-full sm:w-auto px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm inline-flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                      </svg>
                      WhatsApp
                    </a>
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
