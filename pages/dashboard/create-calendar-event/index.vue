<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">
          Create Test Calendar Event
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Use this form to test Google Calendar event creation
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              for="fullname"
              class="block text-sm font-medium text-gray-700"
              >Full Name</label
            >
            <input
              type="text"
              id="fullname"
              v-model="formData.fullname"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              type="email"
              id="email"
              v-model="formData.email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700"
              >Phone Number</label
            >
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label for="theme" class="block text-sm font-medium text-gray-700"
              >Theme</label
            >
            <input
              type="text"
              id="theme"
              v-model="formData.theme"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <!-- Date and Time -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700"
              >Session Date</label
            >
            <input
              type="date"
              id="date"
              v-model="formData.date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label for="time" class="block text-sm font-medium text-gray-700"
              >Session Time</label
            >
            <input
              type="time"
              id="time"
              v-model="formData.time"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-[var(--color-bg-secondary)] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-bg-secondary)]/80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            :disabled="isLoading"
          >
            {{ isLoading ? "Creating..." : "Create Calendar Event" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success/Error Alert -->
    <div
      v-if="alert.show"
      :class="[
        'rounded-md p-4',
        alert.type === 'success' ? 'bg-green-50' : 'bg-red-50',
      ]"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <CheckCircleIcon
            v-if="alert.type === 'success'"
            class="h-5 w-5 text-green-400"
          />
          <XCircleIcon v-else class="h-5 w-5 text-red-400" />
        </div>
        <div class="ml-3">
          <h3
            :class="[
              'text-sm font-medium',
              alert.type === 'success' ? 'text-green-800' : 'text-red-800',
            ]"
          >
            {{ alert.message }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/solid";

definePageMeta({
  layout: "dashboard",
});

const { $apiFetch } = useNuxtApp();

interface FormData {
  fullname: string;
  email: string;
  phone: string;
  theme: string;
  date: string;
  time: string;
}

const formData = ref<FormData>({
  fullname: "",
  email: "",
  phone: "",
  theme: "Test",
  date: "",
  time: "",
});

const isLoading = ref(false);
const alert = ref({
  show: false,
  type: "success",
  message: "",
});

async function handleSubmit() {
  try {
    isLoading.value = true;

    const response = await $apiFetch("/api/calendar/create-test-event", {
      method: "POST",
      body: formData.value,
    });

    alert.value = {
      show: true,
      type: "success",
      message: "Calendar event created successfully!",
    };

    // Reset form
    formData.value = {
      fullname: "",
      email: "",
      phone: "",
      theme: "",
      date: "",
      time: "",
    };
  } catch (error: any) {
    alert.value = {
      show: true,
      type: "error",
      message: error.message || "Failed to create calendar event",
    };
  } finally {
    isLoading.value = false;

    // Hide alert after 5 seconds
    setTimeout(() => {
      alert.value.show = false;
    }, 5000);
  }
}
</script>

<style lang="scss" scoped></style>
