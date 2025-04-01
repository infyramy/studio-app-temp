<script setup>
const categories = [
  {
    name: 'Weddings',
    description: 'Beautiful moments from wedding celebrations',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Beach Wedding'
      },
      {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Garden Ceremony'
      },
      {
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'First Dance'
      }
    ]
  },
  {
    name: 'Portraits',
    description: 'Professional and personal portraits',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Professional Headshot'
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Natural Light Portrait'
      },
      {
        url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Lifestyle Portrait'
      }
    ]
  },
  {
    name: 'Family',
    description: 'Capturing family moments and connections',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Family Outdoors'
      },
      {
        url: 'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Family at Home'
      },
      {
        url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Family Fun'
      }
    ]
  },
  {
    name: 'Events',
    description: 'Corporate and special events coverage',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Corporate Event'
      },
      {
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Conference'
      },
      {
        url: 'https://images.unsplash.com/photo-1496337589254-7e19d01cec44?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        title: 'Special Event'
      }
    ]
  }
]

const selectedCategory = ref(categories[0])

const selectCategory = (category) => {
  selectedCategory.value = category
}
</script>

<template>
  <div class="bg-white">
    <!-- Header -->
    <div class="relative bg-gray-900">
      <div class="absolute inset-0">
        <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Photography" />
        <div class="absolute inset-0 bg-gray-900 mix-blend-multiply"></div>
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Portfolio</h1>
        <p class="mt-6 text-xl text-gray-300 max-w-3xl">
          Explore our collection of professional photography work across various categories.
        </p>
      </div>
    </div>

    <!-- Category Navigation -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center space-x-8">
          <button
            v-for="category in categories"
            :key="category.name"
            @click="selectCategory(category)"
            class="px-3 py-4 text-sm font-medium"
            :class="[
              category === selectedCategory
                ? 'text-[#C4A484] border-b-2 border-[#C4A484]'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Gallery -->
    <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">{{ selectedCategory.name }}</h2>
        <p class="mt-4 text-lg text-gray-500">{{ selectedCategory.description }}</p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        <div v-for="image in selectedCategory.images" :key="image.url" class="group relative">
          <div class="w-full aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
            <img
              :src="image.url"
              :alt="image.title"
              class="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity duration-300"
            />
          </div>
          <div class="mt-4">
            <h3 class="text-sm text-gray-700">{{ image.title }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-[#C4A484]">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Love what you see?</span>
          <span class="block">Let's create something beautiful together.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-[#F5F5DC]">
          Book a session with us and let's capture your special moments.
        </p>
        <NuxtLink
          to="/contact"
          class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#C4A484] bg-white hover:bg-[#F5F5DC] sm:w-auto transition-colors duration-200"
        >
          Book Now
        </NuxtLink>
      </div>
    </div>
  </div>
</template> 