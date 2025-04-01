<script setup>
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  eventType: '',
  date: '',
  message: ''
})

const eventTypes = [
  { id: 'wedding', name: 'Wedding Photography' },
  { id: 'portrait', name: 'Portrait Session' },
  { id: 'family', name: 'Family Photography' },
  { id: 'event', name: 'Event Photography' },
  { id: 'other', name: 'Other' }
]

const loading = ref(false)
const success = ref(false)
const error = ref(null)

const stats = ref({
  totalContacts: 0,
  newContacts: 0,
  responded: 0,
  pending: 0
})

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  success.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    success.value = true
    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.phone = ''
    form.eventType = ''
    form.date = ''
    form.message = ''
  } catch (e) {
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

// Fetch stats data
const fetchStats = async () => {
  // Simulate API call - replace with actual API call
  stats.value = {
    totalContacts: 150,
    newContacts: 25,
    responded: 95,
    pending: 30
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="bg-white">
    <!-- Header -->
    <div class="relative bg-[#C4A484]">
      <div class="absolute inset-0">
        <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Contact" />
        <div class="absolute inset-0 bg-[#C4A484] mix-blend-multiply"></div>
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Contact Us</h1>
        <p class="mt-6 text-xl text-[#F5F5DC] max-w-3xl">
          Get in touch with us to discuss your photography needs. We're here to help capture your special moments.
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 my-5">
      <div class="relative group bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100">
        <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-[var(--color-bg-primary)] bg-opacity-10 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-[var(--color-bg-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-bold text-gray-900">{{ stats.totalContacts }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="relative group bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">New Contacts</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-bold text-gray-900">{{ stats.newContacts }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="relative group bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100">
        <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Responded</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-bold text-gray-900">{{ stats.responded }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="relative group bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-200 hover:shadow-md border border-gray-100">
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pending</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-bold text-gray-900">{{ stats.pending }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="bg-[var(--color-bg-secondary)] shadow-sm rounded-lg">
      <!-- Search and Filters -->
      <div class="bg-[var(--color-bg-secondary)] rounded-lg shadow-sm">
        <!-- Quick Search and Filter Toggle -->
        <div class="p-4 border-b border-[var(--color-border-secondary)]">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div class="flex-1 max-w-lg">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-[var(--color-text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input type="text" placeholder="Search contacts..." class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] sm:text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Table Header -->
        <div class="p-4 md:p-6 bg-white border-b border-gray-200">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <span>Show</span>
              <select class="form-select rounded-lg border-gray-200 text-gray-700 sm:text-sm focus:border-[var(--color-bg-primary)] focus:ring focus:ring-[var(--color-bg-primary)] focus:ring-opacity-50">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span>entries</span>
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="hidden md:block">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-gray-50">
                <th scope="col" class="px-6 py-4 text-left">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</span>
                  </div>
                </th>
                <th scope="col" class="px-6 py-4 text-left">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</span>
                  </div>
                </th>
                <th scope="col" class="px-6 py-4 text-left">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</span>
                  </div>
                </th>
                <th scope="col" class="px-6 py-4 text-left">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                  </div>
                </th>
                <th scope="col" class="px-6 py-4 text-left">
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr class="group hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 flex-shrink-0 rounded-full bg-[var(--color-bg-primary)] bg-opacity-10 flex items-center justify-center">
                      <span class="text-sm font-medium text-[var(--color-bg-primary)]">JD</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">John Doe</div>
                      <div class="text-sm text-gray-500">john@example.com</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] bg-opacity-10 text-[var(--color-primary)]">
                    Wedding Photography
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">2024-03-15</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                    Pending
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <button class="text-gray-400 hover:text-[var(--color-bg-primary)] transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button class="text-gray-400 hover:text-[var(--color-bg-primary)] transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile View -->
        <div class="md:hidden divide-y divide-gray-200">
          <div class="p-4 space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-[var(--color-bg-primary)] bg-opacity-10 flex items-center justify-center">
                  <span class="text-base font-medium text-[var(--color-bg-primary)]">JD</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">John Doe</div>
                  <div class="text-sm text-gray-500">john@example.com</div>
                </div>
              </div>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                Pending
              </span>
            </div>

            <!-- Details -->
            <div class="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-100">
              <div>
                <div class="text-xs text-gray-500 mb-1">Event Type</div>
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-bg-primary)] bg-opacity-10 text-[var(--color-primary)]">
                  Wedding Photography
                </span>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1">Date</div>
                <div class="text-sm text-gray-900">2024-03-15</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3">
              <button class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)]">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>
              <button class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)]">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Details
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="px-4 py-3 md:px-6 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div class="hidden md:flex items-center gap-2">
                <button class="px-3 py-2 text-sm font-medium rounded-lg bg-[var(--color-bg-primary)] text-white">1</button>
                <button class="px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50">2</button>
                <button class="px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50">3</button>
              </div>
              <button class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed">
                Next
                <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div class="text-sm text-gray-500 md:hidden">Page 1 of 3</div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative bg-white mt-8">
      <div class="absolute inset-0">
        <div class="absolute inset-y-0 left-0 w-1/2 bg-gray-50"></div>
      </div>
      <div class="relative max-w-7xl mx-auto lg:grid lg:grid-cols-5">
        <!-- Contact Information -->
        <div class="bg-gray-50 py-16 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
          <div class="max-w-lg mx-auto">
            <h2 class="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">Get in touch</h2>
            <p class="mt-3 text-lg leading-6 text-gray-500">
              Have questions about our services? Want to book a session? We'd love to hear from you.
            </p>
            <dl class="mt-8 text-base text-gray-500">
              <div class="mt-6">
                <dt class="sr-only">Phone number</dt>
                <dd class="flex">
                  <svg class="flex-shrink-0 h-6 w-6 text-[var(--color-bg-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="ml-3">(555) 123-4567</span>
                </dd>
              </div>
              <div class="mt-3">
                <dt class="sr-only">Email</dt>
                <dd class="flex">
                  <svg class="flex-shrink-0 h-6 w-6 text-[var(--color-bg-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="ml-3">info@stitchandshutter.com</span>
                </dd>
              </div>
              <div class="mt-3">
                <dt class="sr-only">Address</dt>
                <dd class="flex">
                  <svg class="flex-shrink-0 h-6 w-6 text-[var(--color-bg-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="ml-3">
                    123 Photography Lane<br />
                    Capture City, PC 12345
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white py-16 px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
          <div class="max-w-lg mx-auto lg:max-w-none">
            <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-y-6">
              <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label for="first-name" class="block text-sm font-medium text-[var(--color-text-primary)]">First name</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      v-model="form.firstName"
                      required
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label for="last-name" class="block text-sm font-medium text-[var(--color-text-primary)]">Last name</label>
                  <div class="mt-1">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      v-model="form.lastName"
                      required
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label for="email" class="block text-sm font-medium text-[var(--color-text-primary)]">Email</label>
                  <div class="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      v-model="form.email"
                      required
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-[var(--color-text-primary)]">Phone</label>
                  <div class="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      v-model="form.phone"
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label for="event-type" class="block text-sm font-medium text-[var(--color-text-primary)]">Event Type</label>
                  <div class="mt-1">
                    <select
                      id="event-type"
                      name="event-type"
                      v-model="form.eventType"
                      required
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] border-gray-300 rounded-lg"
                    >
                      <option value="">Select type</option>
                      <option v-for="type in eventTypes" :key="type.id" :value="type.id">
                        {{ type.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label for="date" class="block text-sm font-medium text-[var(--color-text-primary)]">Preferred Date</label>
                  <div class="mt-1">
                    <input
                      type="date"
                      name="date"
                      id="date"
                      v-model="form.date"
                      class="py-3 px-4 block w-full shadow-sm focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-[var(--color-text-primary)]">Message</label>
                <div class="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    v-model="form.message"
                    required
                    class="py-3 px-4 block w-full shadow-sm focus:ring-[var(--color-bg-primary)] focus:border-[var(--color-bg-primary)] border border-gray-300 rounded-lg"
                  ></textarea>
                </div>
              </div>

              <div>
                <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
                  <div class="text-sm text-red-700">{{ error }}</div>
                </div>

                <div v-if="success" class="rounded-md bg-green-50 p-4 mb-4">
                  <div class="text-sm text-green-700">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-bg-primary)] transition-colors"
                >
                  <svg
                    v-if="loading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{{ loading ? 'Sending...' : 'Send Message' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 