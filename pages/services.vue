<script setup>
const services = [
  {
    name: 'Wedding Photography',
    description: 'Comprehensive wedding day coverage with a second shooter, engagement session, and digital gallery.',
    price: 'Starting at $2,500',
    duration: '8-12 hours',
    features: [
      'Two professional photographers',
      'Engagement photo session',
      'Online gallery with high-resolution images',
      'Wedding day timeline consultation',
      'All edited digital images',
      'Print release'
    ],
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Portrait Sessions',
    description: 'Professional portrait photography for individuals, couples, or professional headshots.',
    price: 'Starting at $300',
    duration: '1-2 hours',
    features: [
      'Professional lighting setup',
      'Multiple outfit changes',
      'Indoor or outdoor locations',
      'Digital image editing',
      '20 edited digital images',
      'Print release'
    ],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Family Photography',
    description: 'Capture beautiful family moments in natural settings or studio environment.',
    price: 'Starting at $400',
    duration: '1-2 hours',
    features: [
      'Up to 6 family members',
      'Multiple poses and groupings',
      'Choice of location',
      'Online gallery',
      '30 edited digital images',
      'Print release'
    ],
    image: 'https://images.unsplash.com/photo-1542037104857-68e6fbdc8923?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Event Photography',
    description: 'Professional coverage for corporate events, parties, and special occasions.',
    price: 'Starting at $800',
    duration: '4-8 hours',
    features: [
      'Event coverage',
      'Candid and posed shots',
      'Professional lighting',
      'Quick turnaround',
      'All edited digital images',
      'Commercial usage rights'
    ],
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
]
</script>

<template>
  <div class="bg-white">
    <!-- Header -->
    <div class="relative bg-[#C4A484]">
      <div class="absolute inset-0">
        <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Photography" />
        <div class="absolute inset-0 bg-[#C4A484] mix-blend-multiply"></div>
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Our Services</h1>
        <p class="mt-6 text-xl text-[#F5F5DC] max-w-3xl">
          Professional photography services tailored to capture your special moments with artistic excellence and attention to detail.
        </p>
      </div>
    </div>

    <!-- Services Grid -->
    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-8 md:gap-y-16">
        <div v-for="service in services" :key="service.name" class="relative flex flex-col bg-white rounded-2xl shadow-xl">
          <div class="h-64 relative">
            <img :src="service.image" :alt="service.name" class="w-full h-full object-cover rounded-t-2xl" />
          </div>
          
          <div class="flex-1 p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-gray-900">{{ service.name }}</h3>
              <p class="text-lg font-semibold text-[#C4A484]">{{ service.price }}</p>
            </div>
            
            <p class="mt-4 text-base text-gray-500">{{ service.description }}</p>
            
            <div class="mt-6">
              <p class="text-sm font-medium text-gray-900">Duration: {{ service.duration }}</p>
              <ul class="mt-4 space-y-3">
                <li v-for="feature in service.features" :key="feature" class="flex items-start">
                  <svg class="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="ml-3 text-base text-gray-500">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="p-6 bg-gray-50 rounded-b-2xl">
            <NuxtLink
              to="/contact"
              class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#C4A484] hover:bg-[#B4917C] transition-colors duration-200"
            >
              Book Now
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-[#C4A484]">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to capture your moments?</span>
          <span class="block">Book your session today.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-[#F5F5DC]">
          Let us help you create beautiful memories that will last a lifetime.
        </p>
        <NuxtLink
          to="/contact"
          class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#C4A484] bg-white hover:bg-[#F5F5DC] sm:w-auto transition-colors duration-200"
        >
          Contact Us
        </NuxtLink>
      </div>
    </div>
  </div>
</template> 