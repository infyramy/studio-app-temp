<script setup lang="ts">
import Chart from "chart.js/auto";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

interface DashboardData {
  stats: {
    totalBookings: number;
    totalPending: number;
    addOns: {
      name: string;
      count: number;
    }[];
    revenue: {
      fullPayment: number;
      deposit: number;
    };
  };
  topAddon?: {
    id: number;
    title: string;
    qty: number;
  };
  chartData?: {
    thirtyDays: Array<{
      date: string;
      bookings: number;
      unique_customers: number;
    }>;
    ninetyDays: Array<{
      date: string;
      bookings: number;
      unique_customers: number;
    }>;
    yearly: Array<{
      month: string;
      bookings: number;
      unique_customers: number;
    }>;
  };
  recentBookings?: Array<{
    id: number;
    name: string;
    theme: string;
    latest_booking: string;
    payment_status: number;
  }>;
  upcomingSessions?: Array<{
    id: number;
    name: string;
    theme: string;
    date: string;
    location: string;
    status: number;
    pax: number;
    time: string;
  }>;
}

interface ApiResponse {
  status: string;
  data: DashboardData;
}

// Fetch dashboard data
const { $apiFetch } = useNuxtApp();
const dashboardData = ref<DashboardData | null>(null);
const pending = ref(false);
const error = ref<Error | null>(null);

async function fetchDashboardData() {
  pending.value = true;
  error.value = null;
  try {
    const response = (await $apiFetch(
      "/api/dashboard/get-data"
    )) as ApiResponse;
    console.log("Response Dashboard", response);

    // Transform the data to match our interface
    dashboardData.value = {
      stats: {
        totalBookings: response.data.stats.totalBookings,
        totalPending: response.data.stats.totalPending,
        addOns: response.data.stats.addOns,
        revenue: response.data.stats.revenue,
      },
      chartData: response.data.chartData,
      recentBookings: response.data.recentBookings,
      upcomingSessions: response.data.upcomingSessions,
    };
  } catch (err: any) {
    console.error("Error fetching dashboard data:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
}

// Stats data transformation
const stats = computed(() => [
  {
    name: "Total Bookings",
    stat: dashboardData.value?.stats.totalBookings?.toString() || "0",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    description: "Total sessions booked",
    change: "10%", // Simulated growth
    changeType: "increase",
  },
  {
    name: "Top Add-ons",
    stat: dashboardData.value?.stats.addOns[0]?.name || "No Addon",
    icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    description: "Most popular add-on packages",
    change: dashboardData.value?.stats.addOns[0]?.count?.toString() || "0",
    changeType: "neutral",
  },
  {
    name: "Pending Sessions",
    stat: dashboardData.value?.stats.totalPending?.toString() || "0",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    description: "Sessions awaiting confirmation",
    change: dashboardData.value?.stats.totalPending?.toString() || "0",
    changeType:
      (dashboardData.value?.stats?.totalPending || 0) > 0
        ? "increase"
        : "neutral",
  },
  {
    name: "Revenue Overview",
    stat: (() => {
      const revenue = dashboardData.value?.stats.revenue;
      if (!revenue) return "RM 0";
      const total = revenue.fullPayment + revenue.deposit;
      return new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(total);
    })(),
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description: (() => {
      const revenue = dashboardData.value?.stats.revenue;
      if (!revenue) return "No revenue data";
      const fullPaymentFormatted = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(revenue.fullPayment);
      const depositFormatted = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(revenue.deposit);
      return `${fullPaymentFormatted} full + ${depositFormatted} deposit`;
    })(),
    change: (() => {
      const revenue = dashboardData.value?.stats.revenue;
      if (!revenue) return "0%";
      const total = revenue.fullPayment + revenue.deposit;
      const fullPaymentPercentage = Math.round(
        (revenue.fullPayment / total) * 100
      );
      return `${fullPaymentPercentage}% full payments`;
    })(),
    changeType: "neutral",
  },
]);

// Format date helper
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (time: string) => {
  if (!time) return "";
  // Split the time string into hours and minutes
  const [hours, minutes] = time.split(":");
  // Create a date object for today with the specified time
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
};

// Chart data structure
const timeRange = ref("30");

interface TimeSeriesDataPoint {
  date?: string;
  month?: string;
  bookings: number;
  unique_customers: number;
}

const selectedTimeSeriesData = computed(() => {
  if (!dashboardData.value) return { labels: [], bookings: [], customers: [] };

  const data: TimeSeriesDataPoint[] =
    timeRange.value === "30"
      ? dashboardData.value.chartData?.thirtyDays || []
      : timeRange.value === "90"
      ? dashboardData.value.chartData?.ninetyDays || []
      : dashboardData.value.chartData?.yearly || [];

  return {
    labels: data.map((d) => (d.date ? formatDate(d.date) : d.month || "")),
    bookings: data.map((d) => d.bookings),
    customers: data.map((d) => d.unique_customers),
  };
});

// Add this ref to store the chart instance
const chart = ref<Chart | null>(null);

// Chart options with proper TypeScript types
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: {
        usePointStyle: true,
        padding: 20,
        boxWidth: 8,
        boxHeight: 8,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "normal",
        },
      },
    },
    tooltip: {
      backgroundColor: "white",
      titleColor: "#111827",
      bodyColor: "#4B5563",
      borderColor: "#E5E7EB",
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      titleFont: {
        size: 14,
        weight: "bold",
        family: "'Inter', sans-serif",
      },
      bodyFont: {
        size: 13,
        weight: "normal",
        family: "'Inter', sans-serif",
      },
      callbacks: {
        title: function (context: any) {
          if (!context[0]) return "";
          const value = context[0].label;
          return value;
        },
        label: function (context: any) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.dataset.yAxisID === "y") {
            label += context.parsed.y + " bookings";
          } else {
            label += context.parsed.y + " customers";
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "normal",
        },
        color: "#6B7280",
        padding: 8,
      },
    },
    y: {
      type: "linear",
      display: true,
      position: "left",
      grid: {
        color: "#F3F4F6",
        drawBorder: false,
      },
      border: {
        dash: [5, 5] as number[],
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "normal",
        },
        color: "#6B7280",
        padding: 8,
        maxTicksLimit: 6,
        stepSize: 1,
      },
      title: {
        display: true,
        text: "Bookings",
        font: {
          size: 13,
          family: "'Inter', sans-serif",
          weight: "bold",
        },
        color: "#374151",
        padding: { bottom: 10 },
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: {
        drawOnChartArea: false,
        drawBorder: false,
      },
      border: {
        dash: [5, 5] as number[],
      },
      ticks: {
        font: {
          size: 12,
          family: "'Inter', sans-serif",
          weight: "normal",
        },
        color: "#6B7280",
        padding: 8,
        maxTicksLimit: 6,
        stepSize: 1,
      },
      title: {
        display: true,
        text: "Customers",
        font: {
          size: 13,
          family: "'Inter', sans-serif",
          weight: "bold",
        },
        color: "#374151",
        padding: { bottom: 10 },
      },
    },
  },
};

// Create chart function
const createChart = () => {
  const ctx = document.getElementById("overview-chart") as HTMLCanvasElement;
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (chart.value) {
    chart.value.destroy();
  }

  // Create gradients
  const context = ctx.getContext("2d");
  if (!context) return;

  const bookingsGradient = context.createLinearGradient(0, 0, 0, 400);
  bookingsGradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
  bookingsGradient.addColorStop(1, "rgba(59, 130, 246, 0)");

  const customersGradient = context.createLinearGradient(0, 0, 0, 400);
  customersGradient.addColorStop(0, "rgba(99, 102, 241, 0.2)");
  customersGradient.addColorStop(1, "rgba(99, 102, 241, 0)");

  // Create new chart
  chart.value = new Chart(ctx, {
    type: "line",
    data: {
      labels: selectedTimeSeriesData.value.labels,
      datasets: [
        {
          label: "Bookings",
          data: selectedTimeSeriesData.value.bookings,
          borderColor: "#3B82F6",
          backgroundColor: bookingsGradient,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: "white",
          pointHoverBackgroundColor: "white",
          pointBorderColor: "#3B82F6",
          pointHoverBorderColor: "#3B82F6",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          yAxisID: "y",
        },
        {
          label: "Customers",
          data: selectedTimeSeriesData.value.customers,
          borderColor: "#6366F1",
          backgroundColor: customersGradient,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: "white",
          pointHoverBackgroundColor: "white",
          pointBorderColor: "#6366F1",
          pointHoverBorderColor: "#6366F1",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          yAxisID: "y1",
        },
      ],
    },
    options: chartOptions,
  });
};

// Initialize chart when component is mounted
onMounted(() => {
  fetchDashboardData();

  if (dashboardData.value) {
    nextTick(() => {
      createChart();
    });
  }
});

// Watch for time range changes and update chart
watch([timeRange, dashboardData], () => {
  if (dashboardData.value) {
    nextTick(() => {
      createChart();
    });
  }
});

const getStatusColor = (status: number) => {
  switch (status) {
    case 4:
      return "bg-red-100 text-[var(--color-error)]";
    case 3:
      return "bg-green-100 text-[var(--color-success)]";
    case 2:
      return "bg-blue-100 text-[var(--color-primary)]";
    case 1:
      return "bg-yellow-100 text-[var(--color-warning)]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSessionStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return "bg-yellow-100 text-[var(--color-warning)]";
    case 2:
      return "bg-green-100 text-[var(--color-success)]";
    case 3:
      return "bg-red-100 text-[var(--color-error)]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getChangeColor = (type: string) => {
  return type === "increase"
    ? "text-[var(--color-success)]"
    : "text-[var(--color-error)]";
};
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center h-96">
      <div class="w-full max-w-3xl space-y-4 p-4">
        <div class="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
        <div class="space-y-3">
          <div class="h-3 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div class="h-3 bg-gray-200 rounded animate-pulse w-4/6"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-96">
      <div class="text-center px-4">
        <p class="text-lg font-medium text-gray-900">Something went wrong</p>
        <p class="mt-1 text-sm text-gray-500">{{ error.message }}</p>
        <button
          type="button"
          @click="() => fetchDashboardData()"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Welcome Section -->
      <div class="">
        <h1 class="text-xl xs:text-2xl font-bold text-gray-900">
          Welcome back!
        </h1>
        <p class="mt-0.5 text-xs sm:text-sm text-gray-500">
          Here's an overview of your photography business.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          v-for="item in stats"
          :key="item.name"
          class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div class="p-3 sm:p-4">
            <div class="flex flex-col min-w-0">
              <span
                class="text-[10px] xs:text-xs sm:text-sm font-medium text-blue-600 truncate"
                >{{ item.name }}</span
              >
              <span
                class="mt-0.5 sm:mt-1 lg:mt-2 text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 truncate"
                >{{ item.stat }}</span
              >
              <p
                class="mt-1 text-[10px] xs:text-xs sm:text-sm text-blue-600 line-clamp-2"
              >
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <!-- Recent Bookings -->
        <div class="bg-white shadow-sm rounded-lg border border-gray-100">
          <div class="p-3 sm:p-4 lg:p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <h2
                  class="text-sm xs:text-base sm:text-lg font-medium text-gray-900"
                >
                  Recent Bookings
                </h2>
                <p
                  class="mt-0.5 text-[10px] xs:text-xs sm:text-sm text-gray-500"
                >
                  Latest photography bookings
                </p>
              </div>
              <NuxtLink
                to="/dashboard/bookings"
                class="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 border border-gray-200 shadow-sm text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                View All
              </NuxtLink>
            </div>
          </div>
          <ul role="list" class="divide-y divide-gray-100">
            <li
              v-for="booking in dashboardData?.recentBookings || []"
              :key="booking.id"
              class="p-3 sm:p-4 lg:p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="flex items-center justify-between">
                <div class="min-w-0 flex-1">
                  <p
                    class="text-xs sm:text-sm font-medium text-gray-900 truncate"
                  >
                    {{ booking.name }}
                  </p>
                  <div
                    class="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1"
                  >
                    <p
                      class="text-[10px] xs:text-xs sm:text-sm text-gray-500 truncate"
                    >
                      {{ booking.theme }}
                    </p>
                    <span class="hidden sm:inline text-gray-500">·</span>
                    <p class="text-[10px] xs:text-xs sm:text-sm text-gray-500">
                      {{ formatDate(booking.latest_booking) }}
                    </p>
                  </div>
                </div>
                <div class="ml-2 sm:ml-4 flex-shrink-0">
                  <span
                    class="inline-flex rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] xs:text-xs font-medium whitespace-nowrap"
                    :class="getStatusColor(booking.payment_status)"
                  >
                    {{
                      booking.payment_status == 1
                        ? "Pending"
                        : booking.payment_status == 2
                        ? "Partial"
                        : booking.payment_status == 3
                        ? "Paid"
                        : booking.payment_status == 4
                        ? "Failed"
                        : "Unknown"
                    }}
                  </span>
                </div>
              </div>
            </li>
            <li
              v-if="(dashboardData?.recentBookings ?? []).length === 0"
              class="p-3 sm:p-4 lg:p-6 text-center"
            >
              <p class="text-[10px] xs:text-xs sm:text-sm text-gray-500">
                No recent bookings
              </p>
            </li>
          </ul>
        </div>

        <!-- Upcoming Sessions -->
        <div class="bg-white shadow-sm rounded-lg border border-gray-100">
          <div class="p-4 sm:p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base sm:text-lg font-medium text-gray-900">
                  Upcoming Sessions
                </h2>
                <p class="mt-1 text-xs sm:text-sm text-gray-500">Next 7 days</p>
              </div>
              <NuxtLink
                to="/dashboard/calendar"
                class="inline-flex items-center px-3 py-1.5 sm:py-2 border border-gray-200 shadow-sm text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                View Calendar
              </NuxtLink>
            </div>
          </div>
          <ul role="list" class="divide-y divide-gray-100">
            <li
              v-for="session in dashboardData?.upcomingSessions || []"
              :key="session.id"
              class="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="flex items-center justify-between">
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ session.name }}
                  </p>
                  <div class="flex flex-wrap items-center gap-2 mt-1">
                    <p class="text-xs sm:text-sm text-gray-500 truncate">
                      {{ session.theme }}
                    </p>
                    <span class="hidden sm:inline text-gray-500">·</span>
                    <p class="text-xs sm:text-sm text-gray-500">
                      {{ session.date ? formatDate(session.date) : "No date" }}
                    </p>
                  </div>

                  <div class="flex flex-wrap items-center gap-2 mt-1">
                    <p class="text-xs sm:text-sm text-gray-500 mt-1">
                      {{ formatTime(session.time) }}
                    </p>
                    <span class="hidden sm:inline text-gray-500">·</span>

                    <p class="text-xs sm:text-sm text-gray-500 mt-1">
                      {{ session.pax || 0 }} Pax
                    </p>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <span
                    class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                    :class="getSessionStatusColor(session.status)"
                  >
                    {{
                      session.status == 1
                        ? "Pending"
                        : session.status == 2
                        ? "Paid"
                        : "Cancelled"
                    }}
                  </span>
                </div>
              </div>
            </li>
            <li
              v-if="(dashboardData?.upcomingSessions ?? []).length === 0"
              class="p-4 sm:p-6 text-center"
            >
              <p class="text-sm text-gray-500">
                No upcoming sessions in the next 7 days
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Monthly Overview Chart -->
      <div
        class="bg-white shadow-sm rounded-lg border border-gray-100 p-4 sm:p-6"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h2
              class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]"
            >
              Monthly Overview
            </h2>
            <p class="mt-1 text-xs sm:text-sm text-[var(--color-text-muted)]">
              Bookings and revenue trends
            </p>
          </div>
          <div class="flex items-center">
            <select
              v-model="timeRange"
              class="w-full sm:w-auto rounded-lg border-gray-200 text-sm focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors duration-200"
            >
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
            </select>
          </div>
        </div>
        <div class="h-[300px] sm:h-[400px] w-full">
          <canvas id="overview-chart"></canvas>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .fc-header-toolbar {
    flex-direction: column;
    gap: 1rem;
  }

  .fc-toolbar-chunk {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .fc-toolbar-title {
    font-size: 1.25rem;
  }
}
</style>
