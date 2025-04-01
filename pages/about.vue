<script setup>
const team = [
  {
    name: "Zahirul Iman",
    role: "Lead Photographer",
    image:
      "https://media-kul2-1.cdn.whatsapp.net/v/t61.24694-24/307097874_467537315296393_1638717566651972614_n.jpg?ccb=11-4&oh=01_Q5AaIKVM_-hi6XXbzyJZ0afknJfLg5YhAi7yhfI7AWc4g0bP&oe=67885F52&_nc_sid=5e03e0&_nc_cat=103",
    bio: "With over 10 years of experience in wedding and portrait photography, Iman leads our creative team with passion and dedication.",
  },
  {
    name: "Ammar Hamzi",
    role: "Senior Photographer",
    image:
      "https://media-kul2-1.cdn.whatsapp.net/v/t61.24694-24/258884766_602910400763975_8487380759821989872_n.jpg?ccb=11-4&oh=01_Q5AaIC51lWbdKhbPVcsiJR2Kdr6SCHGXTRotj2SP5sApxqt8&oe=67887B31&_nc_sid=5e03e0&_nc_cat=103",
    bio: "Specializing in event and corporate photography, Atiff brings technical excellence and creative vision to every shoot.",
  },
  {
    name: "Haqeem Solehan",
    role: "Portrait Specialist",
    image:
      "https://media-kul2-1.cdn.whatsapp.net/v/t61.24694-24/455236964_611018111366016_8838845983731510944_n.jpg?ccb=11-4&oh=01_Q5AaIJM9CaPoj6SC0olAMdMH1fzrD4fPxZF9GfcRfj1oDNFB&oe=678876AD&_nc_sid=5e03e0&_nc_cat=111",
    bio: "Haqeem's eye for capturing genuine emotions and natural beauty makes her our go-to expert for portrait photography.",
  },
];

const values = [
  {
    name: "Quality",
    description:
      "We never compromise on the quality of our work, using top-of-the-line equipment and maintaining the highest standards in photography.",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
  {
    name: "Creativity",
    description:
      "We approach each project with fresh eyes and creative energy, ensuring unique and memorable photographs.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    name: "Professionalism",
    description:
      "Our team maintains the highest level of professionalism in every interaction, from initial consultation to final delivery.",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
];
</script>

<template>
  <div class="bg-white">
    <!-- Header -->
    <div class="relative bg-gray-900">
      <div class="absolute inset-0">
        <img
          class="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Photography"
        />
        <div class="absolute inset-0 bg-gray-900 mix-blend-multiply"></div>
      </div>
      <div
        class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8"
      >
        <h1
          class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          About Us
        </h1>
        <p class="mt-6 text-xl text-gray-300 max-w-3xl">
          Meet the passionate team behind Stitch & Shutter, dedicated to
          capturing your precious moments with creativity and excellence.
        </p>
      </div>
    </div>

    <!-- Our Story -->
    <div class="relative py-16 bg-white overflow-hidden">
      <div class="relative px-4 sm:px-6 lg:px-8">
        <div class="text-lg max-w-prose mx-auto">
          <h2
            class="text-base text-[#C4A484] font-semibold tracking-wide uppercase"
          >
            Our Story
          </h2>
          <p class="mt-8 text-xl text-gray-500 leading-8">
            Founded in 2015, Stitch & Shutter began with a simple mission: to
            capture life's most precious moments with artistry and authenticity.
            What started as a small studio has grown into a team of passionate
            photographers dedicated to creating beautiful memories for our
            clients.
          </p>
          <p class="mt-8 text-xl text-gray-500 leading-8">
            Our journey has been marked by countless smiles, tears of joy, and
            moments of pure magic captured through our lenses. We've had the
            privilege of being part of hundreds of weddings, family
            celebrations, and professional milestones, each one unique and
            special in its own way.
          </p>
        </div>
      </div>
    </div>

    <!-- Values -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2
            class="text-base text-[#C4A484] font-semibold tracking-wide uppercase"
          >
            Our Values
          </h2>
          <p class="mt-2 text-3xl font-extrabold text-gray-900">
            What drives us forward
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="value in values"
            :key="value.name"
            class="relative bg-white p-6 rounded-lg shadow-sm"
          >
            <div>
              <div
                class="absolute h-12 w-12 flex items-center justify-center rounded-md bg-[#C4A484] text-white"
              >
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="value.icon"
                  />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-xl font-medium text-gray-900">
                  {{ value.name }}
                </h3>
                <p class="mt-2 text-base text-gray-500">
                  {{ value.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team -->
    <div class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2
            class="text-base text-[#C4A484] font-semibold tracking-wide uppercase"
          >
            Our Team
          </h2>
          <p class="mt-2 text-3xl font-extrabold text-gray-900">
            Meet the photographers
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div v-for="member in team" :key="member.name" class="space-y-4">
            <div class="aspect-w-3 aspect-h-3">
              <img
                class="object-cover rounded-lg shadow-lg"
                :src="member.image"
                :alt="member.name"
              />
            </div>
            <div class="space-y-2">
              <div class="text-lg leading-6 font-medium space-y-1">
                <h3>{{ member.name }}</h3>
                <p class="text-[#C4A484]">{{ member.role }}</p>
              </div>
              <div class="text-base text-gray-500">
                <p>{{ member.bio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-[#C4A484]">
      <div
        class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8"
      >
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to work with us?</span>
          <span class="block">Let's create memories together.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-[#F5F5DC]">
          Contact us today to discuss your photography needs.
        </p>
        <NuxtLink
          to="/contact"
          class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#C4A484] bg-white hover:bg-[#F5F5DC] sm:w-auto transition-colors duration-200"
        >
          Get in Touch
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
