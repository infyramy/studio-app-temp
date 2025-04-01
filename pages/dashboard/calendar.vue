<script setup>
import {
  ref,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
  computed,
} from "vue";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/vue3";
import { useAuthStore } from "~/stores/auth";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogOverlay,
} from "@headlessui/vue";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { $apiFetch } = useNuxtApp();
const error = ref(null);

const isLoading = ref(true);
const calendarEl = ref(null);
const bookings = ref([]);
const showModal = ref(false);
const selectedBooking = ref(null);
const calendar = ref(null);
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 768
);

// New refs for filters
const themeFilter = ref("all");
const paymentStatusFilter = ref("all");
const sessionStatusFilter = ref("all");

// Helper function for Malaysia timezone conversion
function getMalaysiaTime(date) {
  return new Date(date.getTime() + 8 * 60 * 60 * 1000);
}

// Updated Monthly Bookings computation
const monthlyBookings = computed(() => {
  const malaysiaTime = getMalaysiaTime(new Date());
  const firstDayOfMonth = new Date(
    malaysiaTime.getFullYear(),
    malaysiaTime.getMonth(),
    1,
    0,
    0,
    0
  );
  const lastDayOfMonth = new Date(
    malaysiaTime.getFullYear(),
    malaysiaTime.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  return bookings.value.filter((booking) => {
    const bookingDate = getMalaysiaTime(new Date(booking.start));
    return bookingDate >= firstDayOfMonth && bookingDate <= lastDayOfMonth;
  }).length;
});

// Updated Upcoming Week computation
const upcomingBookings = computed(() => {
  // Get current time in Malaysia timezone
  const malaysiaTime = getMalaysiaTime(new Date());
  malaysiaTime.setHours(0, 0, 0, 0);

  // Set end of next week in Malaysia timezone
  const nextWeek = new Date(malaysiaTime);
  nextWeek.setDate(malaysiaTime.getDate() + 7);
  nextWeek.setHours(23, 59, 59, 999);

  let result = [];

  result = bookings.value.filter((booking) => {
    // Create date from session_date and session_time
    const sessionDate = new Date(booking.extendedProps.session_date);
    const [hours, minutes] = booking.extendedProps.session_time.split(":");
    
    // First convert to Malaysia timezone
    const bookingDate = getMalaysiaTime(sessionDate);
    // Then set the correct hours and minutes
    bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return bookingDate >= malaysiaTime && bookingDate <= nextWeek;
  });

  return result.length;
});

const todayBookings = computed(() => {
  const now = new Date();
  const malaysiaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const today = new Date(
    malaysiaTime.getFullYear(),
    malaysiaTime.getMonth(),
    malaysiaTime.getDate()
  );

  return bookings.value.filter((booking) => {
    const bookingDate = new Date(booking.start);
    // Convert booking date to Malaysia timezone
    const malaysiaBookingDate = new Date(
      bookingDate.getTime() + 8 * 60 * 60 * 1000
    );
    const bookingDay = new Date(
      malaysiaBookingDate.getFullYear(),
      malaysiaBookingDate.getMonth(),
      malaysiaBookingDate.getDate()
    );
    return bookingDay.getTime() === today.getTime();
  }).length;
});

const popularTheme = computed(() => {
  const themeCounts = bookings.value.reduce((acc, booking) => {
    const theme = booking.extendedProps.theme;
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {});

  return (
    Object.entries(themeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
  );
});

// In the script section, add this computed property after other computed properties
const themeOptions = computed(() => {
  const themes = new Set(
    bookings.value.map((booking) => booking.extendedProps.theme)
  );
  return Array.from(themes).filter((theme) => theme); // Filter out any undefined/null values
});

// Update the filteredBookings computed property to ensure it returns the correct format
const filteredBookings = computed(() => {
  const filtered =
    themeFilter.value === "all"
      ? bookings.value
      : bookings.value.filter(
          (booking) => booking.extendedProps?.theme === themeFilter.value
        );

  // console.log('Filtered bookings:', filtered.length); // Debug log
  return filtered;
});

// Update the watch for themeFilter
watch(
  themeFilter,
  (newValue) => {
    // console.log('Theme filter changed to:', newValue);
    if (calendar.value) {
      calendar.value.getEventSources().forEach((source) => source.remove());
      calendar.value.addEventSource(filteredBookings.value);
    }
  },
  { immediate: true }
);

// Modify the calendar event rendering to include status-based colors
const getEventColor = (status) => {
  const statusNum = Number(status);
  switch (statusNum) {
    case 1:
      return "#F59E0B"; // Pending - Yellow/Amber
    case 2:
      return "#3B82F6"; // Partial Paid - Blue
    case 3:
      return "#10B981"; // Full Paid - Green
    case 4:
      return "#EF4444"; // Failed - Red
    default:
      return "#785340"; // Default brown
  }
};

// Fetch bookings from our API
const fetchBookings = async () => {
  try {
    // console.log("Fetching bookings...");
    const response = await $apiFetch("/api/calendar/get-confirm-bookings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response || !Array.isArray(response)) {
      throw new Error("Invalid response format");
    }

    bookings.value = response.map((booking) => {
      // Create Date object for the session time
      const sessionDate = new Date(booking.session_date);
      const [hours, minutes] = booking.session_time.split(":");

      // Set the correct hours and minutes for the time
      const startTime = new Date(sessionDate);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0);

      return {
        id: booking.id,
        title: `${booking.user_fullname} - ${booking.theme_title}`,
        start: startTime.toISOString(),
        allDay: false,
        backgroundColor: getEventColor(booking.status),
        borderColor: getEventColor(booking.status),
        extendedProps: {
          email: booking.user_email,
          phone: booking.user_phoneno,
          theme: booking.theme_title,
          session_date: booking.session_date,
          session_time: booking.session_time,
          status: booking.status,
          fullname: booking.user_fullname,
          created_date: booking.created_date,
        },
      };
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    error.value = "Failed to fetch bookings. Please try again.";
    bookings.value = [];
    throw err;
  } finally {
    isLoading.value = false;
  }
};

// Update the resetFilters function
const resetFilters = async () => {
  themeFilter.value = "all";
  if (calendar.value) {
    try {
      calendar.value.removeAllEvents();
      calendar.value.addEventSource(filteredBookings.value);
      await calendar.value.render();
    } catch (err) {
      console.error("Error resetting calendar events:", err);
    }
  }
};

// Handle window resize
function handleResize() {
  windowWidth.value = window.innerWidth;
  if (calendar.value) {
    calendar.value.destroy();
    initCalendar();
  }
}

// Add new refs and methods for modal handling
const handleEventClick = (info) => {
  try {
    console.log("Event clicked:", info.event);
    const booking = {
      ...info.event.extendedProps,
      title: info.event.title,
      date: info.event.start,
    };
    selectedBooking.value = booking;
    showModal.value = true;

    console.log("Selected booking:", selectedBooking.value);
  } catch (error) {
    console.error("Error handling event click:", error);
  }
};

const closeModal = () => {
  showModal.value = false;
};

// Initialize calendar with Vue 3 adapter
const initCalendar = async () => {
  try {
    const calendarElement = calendarEl.value?.$el || calendarEl.value;

    if (!calendarElement) {
      console.error("Calendar element not found");
      return;
    }

    // Clear any existing calendar instance
    if (calendar.value) {
      calendar.value.destroy();
    }

    const isSmallScreen = windowWidth.value < 768;

    calendar.value = new Calendar(calendarElement, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: isSmallScreen ? "listWeek" : "dayGridMonth",
      headerToolbar: {
        left: isSmallScreen ? "prev,next" : "prev,next today",
        center: "title",
        right: isSmallScreen
          ? "dayGridMonth,listWeek"
          : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      },
      events: filteredBookings.value,
      eventClick: handleEventClick,
      themeSystem: "standard",
      height: "auto",
      expandRows: true,
      slotMinTime: "08:00:00",
      slotMaxTime: "20:00:00",
      allDaySlot: false,
      slotDuration: "01:00:00",
      dayMaxEvents: true,
      eventColor: "var(--color-bg-tertiary)",
      eventTextColor: "var(--color-text-light)",
      eventTimeFormat: {
        hour: "2-digit",
        minute: "2-digit",
        meridiem: false,
      },
      views: {
        timeGrid: {
          dayMaxEvents: 3,
        },
        dayGrid: {
          dayMaxEvents: isSmallScreen ? 2 : 3,
        },
      },
    });

    await calendar.value.render();
  } catch (err) {
    console.error("Error initializing calendar:", err);
    error.value = "Failed to initialize calendar. Please refresh the page.";
    throw err;
  }
};

// Update the onMounted hook
onMounted(async () => {
  try {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    // Fetch and initialize
    await fetchBookings();
    await nextTick();
    await initCalendar();

    // Add event listeners
    document.addEventListener("keydown", handleKeydown);
  } catch (err) {
    console.error("Error in onMounted:", err);
    error.value = err.message || "Failed to load calendar";
    isLoading.value = false;
  }
});

// Clean up event listeners
onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }
  document.removeEventListener("keydown", handleKeydown);
  if (calendar.value) {
    calendar.value.destroy();
  }
});

// Update the watch for bookings
watch(
  bookings,
  () => {
    if (calendar.value) {
      calendar.value.getEventSources().forEach((source) => source.remove());
      calendar.value.addEventSource(filteredBookings.value);
      calendar.value.render();
    }
  },
  { deep: true }
);

const getStatusBadgeClass = (status) => {
  const statusNum = Number(status);
  switch (statusNum) {
    case 1:
      return "bg-yellow-100 text-yellow-800"; // Pending
    case 2:
      return "bg-blue-100 text-blue-800"; // Partial Paid
    case 3:
      return "bg-green-100 text-green-800"; // Full Paid
    case 4:
      return "bg-red-100 text-red-800"; // Failed
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status) => {
  const statusNum = Number(status);
  switch (statusNum) {
    case 1:
      return "Pending";
    case 2:
      return "Partial Paid";
    case 3:
      return "Full Paid";
    case 4:
      return "Failed";
    default:
      return "Unknown";
  }
};

// Add keyboard event handler
const handleKeydown = (e) => {
  if (e.key === "Escape" && showModal.value) {
    closeModal();
  }
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    dateStyle: "medium",
  });
}

function formatTime(timeString) {
  // Handle time string in format "HH:mm:ss"
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  return date.toLocaleTimeString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    timeStyle: "short",
    hour12: true, // This will show time in 12-hour format with AM/PM
  });
}

// First, create a computed property for calendar options
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: windowWidth.value < 768 ? "listWeek" : "dayGridMonth",
  headerToolbar: {
    left: windowWidth.value < 768 ? "prev,next" : "prev,next today",
    center: "title",
    right:
      windowWidth.value < 768
        ? "dayGridMonth,listWeek"
        : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },
  events: filteredBookings.value, // Use filteredBookings instead of bookings
  eventClick: handleEventClick,
  themeSystem: "standard",
  height: "auto",
  expandRows: true,
  slotMinTime: "08:00:00",
  slotMaxTime: "20:00:00",
  allDaySlot: false,
  slotDuration: "01:00:00",
  dayMaxEvents: true,
  eventColor: "var(--color-bg-tertiary)",
  eventTextColor: "var(--color-text-light)",
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    meridiem: false,
  },
  views: {
    timeGrid: {
      dayMaxEvents: 3,
    },
    dayGrid: {
      dayMaxEvents: windowWidth.value < 768 ? 2 : 3,
    },
  },
}));
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Calendar</h1>
            <p class="mt-1 text-sm text-gray-500">
              View and manage your booking schedule
            </p>
          </div>

          <!-- Mobile Menu Button -->
          <button
            type="button"
            class="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#785340]"
            @click="$emit('toggle-mobile-menu')"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Monthly Bookings -->
        <div
          class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:from-blue-100 hover:to-blue-200"
        >
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span
                  class="text-xs sm:text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors"
                  >Monthly Bookings</span
                >
                <span
                  class="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-blue-900"
                  >{{ monthlyBookings }}</span
                >
              </div>
              <div
                class="p-2 sm:p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
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
        </div>

        <!-- Upcoming Bookings -->
        <div
          class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:from-amber-100 hover:to-amber-200"
        >
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span
                  class="text-xs sm:text-sm font-medium text-amber-600 group-hover:text-amber-700 transition-colors"
                  >Upcoming Week</span
                >
                <span
                  class="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-amber-900"
                  >{{ upcomingBookings }}</span
                >
              </div>
              <div
                class="p-2 sm:p-3 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 sm:w-6 sm:h-6 text-amber-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Today's Bookings -->
        <div
          class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:from-emerald-100 hover:to-emerald-200"
        >
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span
                  class="text-xs sm:text-sm font-medium text-emerald-600 group-hover:text-emerald-700 transition-colors"
                  >Today's Sessions</span
                >
                <span
                  class="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-emerald-900"
                  >{{ todayBookings }}</span
                >
              </div>
              <div
                class="p-2 sm:p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 8v4l3 3"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Theme -->
        <div
          class="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:from-violet-100 hover:to-violet-200"
        >
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between">
              <div class="flex flex-col max-w-[calc(100%-3rem)]">
                <span
                  class="text-xs sm:text-sm font-medium text-violet-600 group-hover:text-violet-700 transition-colors"
                  >Popular Theme</span
                >
                <span
                  class="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-violet-900 truncate"
                  >{{ popularTheme }}</span
                >
              </div>
              <div
                class="p-2 sm:p-3 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 sm:w-6 sm:h-6 text-violet-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div
        class="mt-4 flex flex-col gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100"
      >
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <span class="text-sm font-medium text-gray-500"
            >Filter by Theme:</span
          >

          <!-- Theme Filter -->
          <div class="relative flex-1">
            <select
              v-model="themeFilter"
              class="w-full sm:w-48 appearance-none pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">All Themes</option>
              <option v-for="theme in themeOptions" :key="theme" :value="theme">
                {{ theme }}
              </option>
            </select>
            <div class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
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
                <path
                  d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
                ></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <div
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
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
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          <!-- Reset Button -->
          <button
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
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

          <!-- Quick Actions -->
          <div class="flex gap-3">
            <button
              @click="exportCalendar"
              class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              <svg
                class="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span class="hidden sm:inline">Export Calendar</span>
              <span class="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Container -->
    <div
      class="mt-4 sm:mt-6 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
    >
      <!-- Error State -->
      <div v-if="error" class="p-4 sm:p-6">
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Error Loading Calendar
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
              <div class="mt-4">
                <button
                  type="button"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  @click="window.location.reload()"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="p-4 sm:p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-8 bg-gray-200 rounded w-1/4"></div>
          <div class="space-y-3">
            <div class="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Calendar -->
      <div v-else class="p-2 sm:p-6">
        <FullCalendar ref="calendarEl" :options="calendarOptions" />
      </div>
    </div>

    <!-- Booking Details Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="showModal" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-[100]">
          <div class="fixed inset-0 overflow-y-auto">
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
              <DialogOverlay
                class="fixed inset-0 bg-black/50 backdrop-blur-sm"
                aria-hidden="true"
              />
            </TransitionChild>

            <!-- Modal Container -->
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
                  class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <!-- Mobile Header with close button -->
                  <div
                    class="sm:hidden flex items-center justify-between mb-4 pb-3 border-b border-gray-200"
                  >
                    <DialogTitle
                      as="h3"
                      class="text-lg font-semibold text-gray-900"
                    >
                      Booking Details
                    </DialogTitle>
                    <button
                      type="button"
                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      @click="closeModal"
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

                  <!-- Desktop Header -->
                  <div class="hidden sm:block">
                    <div class="flex items-start justify-between">
                      <DialogTitle
                        as="h3"
                        class="text-lg font-semibold leading-6 text-gray-900"
                      >
                        {{ selectedBooking?.title || "Booking Details" }}
                      </DialogTitle>
                      <button
                        type="button"
                        class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-bg-tertiary)] focus:ring-offset-2"
                        @click="closeModal"
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

                  <!-- Booking Details Content -->
                  <div v-if="selectedBooking" class="mt-4 space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-500"
                          >Customer Name</label
                        >
                        <div class="mt-1 text-sm text-gray-900">
                          {{ selectedBooking.fullname }}
                        </div>
                      </div>
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-500"
                          >Email</label
                        >
                        <div class="mt-1 text-sm text-gray-900 break-all">
                          {{ selectedBooking.email }}
                        </div>
                      </div>
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-500"
                          >Phone</label
                        >
                        <div class="mt-1 text-sm text-gray-900">
                          {{ selectedBooking.phone }}
                        </div>
                      </div>
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-500"
                          >Theme</label
                        >
                        <div class="mt-1 text-sm text-gray-900">
                          {{ selectedBooking.theme }}
                        </div>
                      </div>
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-500"
                          >Status</label
                        >
                        <div class="mt-1">
                          <span
                            :class="[
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                              getStatusBadgeClass(selectedBooking.status),
                            ]"
                          >
                            {{ getStatusText(selectedBooking.status) }}
                          </span>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-500"
                          >Session Date</label
                        >
                        <div class="mt-1 text-sm text-gray-900">
                          {{ formatDate(selectedBooking.session_date) }} -
                          {{ formatTime(selectedBooking.session_time) }}
                        </div>
                      </div>
                      <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-500"
                          >Booking Created</label
                        >
                        <div class="mt-1 text-sm text-gray-900">
                          {{ formatDate(selectedBooking.created_date) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-4">
                    <p class="text-gray-500">No booking details available</p>
                  </div>

                  <!-- Modal Footer -->
                  <div class="mt-6 flex justify-end">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-tertiary)] transition-colors duration-200"
                      @click="closeModal"
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
  </div>
</template>

<style scoped>
.fc-theme-standard .fc-toolbar {
  @apply px-3 sm:px-4 py-2 sm:py-3 border-b border-[var(--color-border-primary)];
}

.fc-theme-standard .fc-toolbar-title {
  @apply text-base sm:text-lg font-medium text-[var(--color-text-primary)];
}

.fc-theme-standard .fc-button {
  @apply inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-[var(--color-border-primary)] shadow-sm text-xs sm:text-sm font-medium rounded-md text-[var(--color-text-primary)] bg-[var(--color-bg-white)] hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-tertiary)] transition-colors duration-200;
}

.fc-theme-standard .fc-button-primary {
  @apply bg-[var(--color-bg-tertiary)] border-[var(--color-bg-tertiary)] text-white hover:bg-[var(--color-bg-tertiary)] focus:ring-[var(--color-bg-tertiary)];
}

.fc-theme-standard .fc-button-active {
  @apply bg-[var(--color-bg-tertiary)] border-[var(--color-bg-tertiary)];
}

.fc-theme-standard td,
.fc-theme-standard th {
  @apply border border-gray-200;
}

.fc-theme-standard .fc-day-today {
  @apply bg-[var(--color-bg-primary)];
}

.fc-theme-standard .fc-event {
  @apply border-[var(--color-bg-tertiary)] rounded-md shadow-sm;
}

.fc-theme-standard .fc-event-main {
  @apply px-2 py-1;
}

.fc-theme-standard .fc-event-time {
  @apply font-medium;
}

/* Mobile List View Styles */
@media (max-width: 767px) {
  .fc-list-event {
    @apply px-3 py-2 border-b border-gray-100;
  }

  .fc-list-event-title {
    @apply text-sm font-medium text-gray-900;
  }

  .fc-list-event-time {
    @apply text-xs text-gray-500;
  }

  .fc-list-day-cushion {
    @apply bg-[#F5E6E0]/30 px-3 py-2 sticky top-0 z-10;
  }

  .fc-list-day-text {
    @apply text-sm font-medium text-gray-900;
  }

  .fc-list-day-side-text {
    @apply text-xs text-gray-500;
  }

  .fc-toolbar-title {
    @apply text-base;
  }

  .fc-button {
    @apply px-2 py-1 text-xs;
  }

  .fc-header-toolbar {
    @apply flex-wrap gap-2;
  }

  .fc-toolbar-chunk {
    @apply flex-grow;
  }

  .fc .fc-toolbar.fc-header-toolbar {
    @apply mb-3;
  }

  .fc .fc-button {
    @apply py-1 px-2;
  }

  .fc .fc-button-group {
    @apply gap-1;
  }

  .fc .fc-list-event-dot {
    @apply w-2 h-2;
  }
}
</style>
