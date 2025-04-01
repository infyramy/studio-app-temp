<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)]">
    <!-- Sidebar Navigation -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-bg-primary)] border-r border-[var(--color-border-primary)] transform lg:translate-x-0 transition-transform duration-300 ease-in-out"
      :class="[
        showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Logo -->
      <div
        class="h-20 flex items-center justify-center px-4 border-b border-[var(--color-border-primary)]"
      >
        <div class="flex justify-center items-center gap-3 group mt-3">
          <div
            v-if="isLoading"
            class="w-auto h-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"
          ></div>
          <img
            v-else
            :src="logo"
            alt="Logo"
            class="w-auto h-12"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto">
        <div class="px-3 py-4 space-y-6">
          <!-- Main -->
          <div>
            <div
              class="px-3 mb-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider"
            >
              Main
            </div>
            <NuxtLink
              to="/dashboard"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="[
                $route.path === '/dashboard'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]',
              ]"
            >
              <svg
                class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                :class="[
                  $route.path === '/dashboard'
                    ? 'text-white'
                    : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]',
                ]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </NuxtLink>
          </div>

          <!-- Booking Management -->
          <div>
            <div
              class="px-3 mb-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider"
            >
              Booking Management
            </div>
            <div class="space-y-1">
              <NuxtLink
                v-for="item in bookingNavigation"
                :key="item.name"
                :to="item.href"
                class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
                :class="[
                  $route.path === item.href
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]',
                ]"
              >
                <svg
                  class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  :class="[
                    $route.path === item.href
                      ? 'text-white'
                      : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]',
                  ]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="item.icon"
                  />
                </svg>
                <span>{{ item.name }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Customization -->
          <div>
            <div
              class="px-3 mb-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider"
            >
              Customization
            </div>
            <div class="space-y-1">
              <NuxtLink
                v-for="item in customizationNavigation"
                :key="item.name"
                :to="item.href"
                class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
                :class="[
                  $route.path === item.href
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]',
                ]"
              >
                <svg
                  class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  :class="[
                    $route.path === item.href
                      ? 'text-white'
                      : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]',
                  ]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="item.icon"
                  />
                </svg>
                <span>{{ item.name }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Organization -->
          <div>
            <div
              class="px-3 mb-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider"
            >
              Organization
            </div>
            <div class="space-y-1">
              <NuxtLink
                v-for="item in organizationNavigation"
                :key="item.name"
                :to="item.href"
                class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
                :class="[
                  $route.path === item.href
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]',
                ]"
              >
                <svg
                  class="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  :class="[
                    $route.path === item.href
                      ? 'text-white'
                      : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]',
                  ]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="item.icon"
                  />
                </svg>
                <span>{{ item.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-64 min-h-screen flex flex-col">
      <!-- Top Navigation Bar -->
      <header
        class="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)]"
      >
        <div class="flex items-center h-16 px-4">
          <!-- Mobile Menu Button -->
          <button
            type="button"
            class="lg:hidden p-2 rounded-md text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)]"
            @click="toggleMobileMenu"
          >
            <span class="sr-only">{{
              showMobileMenu ? "Close menu" : "Open menu"
            }}</span>
            <svg
              class="h-6 w-6"
              :class="{ hidden: showMobileMenu }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              class="h-6 w-6"
              :class="{ hidden: !showMobileMenu }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Spacer -->
          <div class="flex-1"></div>

          <!-- User Menu -->
          <div class="relative z-50">
            <button
              type="button"
              ref="userMenuButton"
              class="flex items-center gap-2 max-w-xs rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] hover:bg-[var(--color-bg-primary)] transition-all duration-200 group"
              id="user-menu-button"
              @click="
                (e) => {
                  e.stopPropagation();
                  showProfileMenu = !showProfileMenu;
                }
              "
            >
              <div
                class="h-8 w-8 rounded-full bg-opacity-10 flex items-center justify-center ring-2 ring-[var(--color-primary)] ring-opacity-25"
              >
                <img
                  :src="logo"
                  alt="Logo"
                  class="w-auto h-auto rounded-full"
                />
              </div>
              <div class="hidden md:block text-left">
                <div
                  class="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  {{ user?.companyName || "Company Name" }}
                </div>
                <div class="text-xs text-[var(--color-text-secondary)]">
                  {{ user?.companyEmail || "Company Email" }}
                </div>
              </div>
              <svg
                class="hidden md:block w-4 h-4 text-[var(--color-text-secondary)] transition-transform duration-200"
                :class="{ 'rotate-180': showProfileMenu }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Profile Dropdown -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showProfileMenu"
                ref="userMenuDropdown"
                class="absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-[var(--color-bg-primary)] ring-1 ring-[var(--color-border-primary)] focus:outline-none divide-y divide-[var(--color-border-primary)] origin-top-right z-50"
                @click.stop
              >
                <!-- User Info Section -->
                <div class="px-4 py-3">
                  <div
                    class="text-sm font-medium text-[var(--color-text-primary)]"
                  >
                    {{ user?.companyName || "Company Name" }}
                  </div>
                  <div class="text-xs text-[var(--color-text-secondary)] mt-1">
                    {{ user?.companyEmail || "Company Email" }}
                  </div>
                </div>

                <!-- Logout Section -->
                <div class="py-1">
                  <button
                    @click="handleLogout"
                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 pt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile Menu Backdrop -->
    <div
      v-if="showMobileMenu"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm z-40 lg:hidden"
      @click="showMobileMenu = false"
    />
  </div>
</template>

<script setup>
import { useImage } from "@vueuse/core";

const auth = useAuthStore();
const showProfileMenu = ref(false);
const showMobileMenu = ref(false);

// Initialize auth and setup click outside handler
const userMenuButton = ref(null);
const userMenuDropdown = ref(null);

function handleClickOutside(event) {
  // Only handle click outside if the menu is open
  if (!showProfileMenu.value) return;

  const target = event.target;
  const button = userMenuButton.value;
  const dropdown = userMenuDropdown.value;

  // Check if click is outside both the button and dropdown
  if (
    button &&
    dropdown &&
    !button.contains(target) &&
    !dropdown.contains(target)
  ) {
    showProfileMenu.value = false;
  }
}

onMounted(async () => {
  await auth.fetchUser();
  // Add click outside handler for profile menu
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  // Clean up event listener
  window.removeEventListener("click", handleClickOutside);
});

const user = computed(() => auth.getUser);
const userInitial = computed(() => {
  const name = user.value?.name?.trim() || "U";
  return name.charAt(0).toUpperCase();
});

const handleLogout = async () => {
  await auth.logout();
  navigateTo("/login");
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Bookings",
    href: "/dashboard/bookings",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    name: "Contacts",
    href: "/dashboard/contacts",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    name: "Themes",
    href: "/dashboard/themes",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    name: "Addons",
    href: "/dashboard/addons",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
];

// Grouped navigation items
const bookingNavigation = [
  {
    name: "Bookings",
    href: "/dashboard/bookings",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    name: "Contacts",
    href: "/dashboard/contacts",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
];

const customizationNavigation = [
  {
    name: "Themes",
    href: "/dashboard/themes",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    name: "Addons",
    href: "/dashboard/addons",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
  },
];

const organizationNavigation = [
  {
    name: "Organization",
    href: "/dashboard/organization",
    icon: "M12 2L2 22h20L12 2z",
  },
  {
    name: "Referral",
    href: "/dashboard/referral",
    icon: "M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z M13 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M21 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75",
  },
  {
    name: "Create Calendar Event",
    href: "/dashboard/create-calendar-event",
    icon: "M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z M13 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M21 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75",
  },
];

const logo = ref("");
const isLoading = ref(true);

const handleImageError = () => {
  console.error("Failed to load logo");
  isLoading.value = false;
};

const getConfig = async () => {
  isLoading.value = true;
  try {
    const config = await $fetch("/api/booking/get-config");
    logo.value = config.logo;
  } catch (error) {
    console.error("Failed to fetch config:", error);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getConfig();
});
</script>

<style scoped>
.router-link-active {
  @apply bg-[var(--color-primary)] text-white;
}

.router-link-active svg {
  @apply text-white;
}
</style>
