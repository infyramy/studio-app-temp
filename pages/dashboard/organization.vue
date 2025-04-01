<template>
  <div class="">
    <!-- Status Modal -->
    <StatusModal
      :is-open="modalState.isOpen"
      :status="modalState.status"
      :title="modalState.title"
      :message="modalState.message"
      @close="closeModal"
    />

    <!-- Page Header -->
    <div class="mb-6 sm:mb-8">
      <h1
        class="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)]"
      >
        Organization
      </h1>
      <p class="mt-1 sm:mt-2 text-sm text-[var(--color-text-secondary)]">
        Manage your company details and SSM information
      </p>
    </div>

    <!-- Organization Form -->
    <div class="bg-white rounded-lg border border-gray-100 shadow-sm">
      <!-- Organization Details Section -->
      <div class="p-4 border-b border-gray-100">
        <h3 class="text-lg font-medium text-[var(--color-text-primary)]">
          Organization Details
        </h3>
        <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
          Update your company information and location details
        </p>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-1 gap-6">
          <!-- Company Name -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Company Name
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="form.companyName"
                placeholder="Enter company name"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.companyName
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.companyName" class="mt-1 text-sm text-red-600">
                {{ errors.companyName }}
              </p>
            </div>
          </div>

          <!-- Company Email -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Company Email
            </label>

            <div class="relative">
              <input
                type="email"
                v-model="form.companyEmail"
                placeholder="Enter company email"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.companyEmail
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.companyEmail" class="mt-1 text-sm text-red-600">
                {{ errors.companyEmail }}
              </p>
            </div>
          </div>

          <!-- Company Address -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Company Address
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="form.companyAddress"
                placeholder="Enter company address"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.companyAddress
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.companyAddress" class="mt-1 text-sm text-red-600">
                {{ errors.companyAddress }}
              </p>
            </div>
          </div>

          <!-- SSM Number -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              SSM Number
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="form.ssmNumber"
                placeholder="Enter SSM number"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.ssmNumber
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.ssmNumber" class="mt-1 text-sm text-red-600">
                {{ errors.ssmNumber }}
              </p>
            </div>
          </div>

          <!-- Company Logo -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Company Logo
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="form.logoUrl"
                placeholder="Enter company logo"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.logoUrl
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.logoUrl" class="mt-1 text-sm text-red-600">
                {{ errors.logoUrl }}
              </p>
            </div>
          </div>

          <!-- Company Logo -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Bank QR Code
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="form.bankQrCode"
                placeholder="Enter bank QR code"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.bankQrCode
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.bankQrCode" class="mt-1 text-sm text-red-600">
                {{ errors.bankQrCode }}
              </p>
            </div>
          </div>

          <!-- Waze URL -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Waze URL
            </label>
            <div class="relative">
              <input
                type="url"
                v-model="form.wazeUrl"
                placeholder="Enter Waze location URL"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.wazeUrl
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.wazeUrl" class="mt-1 text-sm text-red-600">
                {{ errors.wazeUrl }}
              </p>
            </div>
            <p class="text-xs text-[var(--color-text-secondary)]">
              To get Waze URL: Open Waze app > Search your location > Tap Share
              > Copy link
            </p>
          </div>

          <!-- Google Maps URL -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Google Maps URL
            </label>
            <div class="relative">
              <input
                type="url"
                v-model="form.googleMapsUrl"
                placeholder="Enter Google Maps location URL"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.googleMapsUrl
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.googleMapsUrl" class="mt-1 text-sm text-red-600">
                {{ errors.googleMapsUrl }}
              </p>
            </div>
            <p class="text-xs text-[var(--color-text-secondary)]">
              To get Google Maps URL: Open Google Maps > Search your location >
              Click Share > Copy link
            </p>
          </div>
        </div>
      </div>

      <!-- Bank Details Section -->
      <div class="p-4 border-t border-b border-gray-100">
        <h3 class="text-lg font-medium text-[var(--color-text-primary)]">
          Bank Details
        </h3>
        <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
          Update your banking and payment information
        </p>
      </div>
      <div class="p-4">
        <div class="grid grid-cols-1 gap-6">
          <!-- Bank -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Bank
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="form.bankName"
                placeholder="Enter bank name"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.bankName
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.bankName" class="mt-1 text-sm text-red-600">
                {{ errors.bankName }}
              </p>
            </div>
          </div>

          <!-- Bank Account No -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Bank Account No
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="form.bankAccountNo"
                placeholder="Enter bank account number"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.bankAccountNo
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p v-if="errors.bankAccountNo" class="mt-1 text-sm text-red-600">
                {{ errors.bankAccountNo }}
              </p>
            </div>
          </div>

          <!-- Bank Account Holder -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Bank Account Holder
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="form.bankAccountHolder"
                placeholder="Enter account holder name"
                :class="[
                  'block w-full rounded-md border py-2 px-3 text-sm transition-all duration-200 bg-white',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  errors.bankAccountHolder
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20'
                    : 'border-gray-300 hover:border-[var(--color-primary-light)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                ]"
              />
              <p
                v-if="errors.bankAccountHolder"
                class="mt-1 text-sm text-red-600"
              >
                {{ errors.bankAccountHolder }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div
        class="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 flex justify-end"
      >
        <button
          @click="saveOrganizationDetails"
          :disabled="isLoading"
          class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isLoading ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusModal from "~/components/common/StatusModal.vue";
import type { FetchError } from "ofetch";

definePageMeta({
  layout: "dashboard",
});

const { $apiFetch } = useNuxtApp();

interface Form {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  ssmNumber: string;
  logoUrl: string;
  wazeUrl: string;
  googleMapsUrl: string;
  bankQrCode: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountHolder: string;
}

interface Errors {
  companyName?: string;
  companyEmail?: string;
  companyAddress?: string;
  ssmNumber?: string;
  logoUrl?: string;
  wazeUrl?: string;
  googleMapsUrl?: string;
  bankQrCode?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountHolder?: string;
}

interface ApiResponse {
  statusCode: number;
  message?: string;
  data?: {
    companyName?: string;
    companyEmail?: string;
    companyAddress?: string;
    ssmNumber?: string;
    logoUrl?: string;
    wazeUrl?: string;
    googleMapsUrl?: string;
    bankQrCode?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankAccountHolder?: string;
  };
}

// Form state
const form = ref<Form>({
  companyName: "",
  companyEmail: "",
  companyAddress: "",
  ssmNumber: "",
  logoUrl: "",
  wazeUrl: "",
  googleMapsUrl: "",
  bankQrCode: "",
  bankName: "",
  bankAccountNo: "",
  bankAccountHolder: "",
});

// Error state
const errors = ref<Errors>({});

// Loading state
const isLoading = ref(false);

// Modal state
const modalState = ref({
  isOpen: false,
  status: "success" as "success" | "error",
  title: "",
  message: "",
});

function showModal(
  status: "success" | "error",
  title: string,
  message: string
) {
  modalState.value = {
    isOpen: true,
    status,
    title,
    message,
  };
}

function closeModal() {
  modalState.value.isOpen = false;
}

// Fetch organization details
async function fetchOrganizationDetails() {
  try {
    isLoading.value = true;
    const response = (await $apiFetch(
      "/api/setting/get-organization"
    )) as ApiResponse;

    if (response.statusCode === 200 && response.data) {
      form.value.companyName = response.data.companyName || "";
      form.value.companyEmail = response.data.companyEmail || "";
      form.value.companyAddress = response.data.companyAddress || "";
      form.value.ssmNumber = response.data.ssmNumber || "";
      form.value.logoUrl = response.data.logoUrl || "";
      form.value.wazeUrl = response.data.wazeUrl || "";
      form.value.googleMapsUrl = response.data.googleMapsUrl || "";
      form.value.bankQrCode = response.data.bankQrCode || "";
      form.value.bankName = response.data.bankName || "";
      form.value.bankAccountNo = response.data.bankAccountNo || "";
      form.value.bankAccountHolder = response.data.bankAccountHolder || "";
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to load organization details"
    );
  } finally {
    isLoading.value = false;
  }
}

// Save organization details
async function saveOrganizationDetails() {
  try {
    errors.value = {};

    // Organization details validation
    if (!form.value.companyName) {
      errors.value.companyName = "Company name is required";
    }
    if (!form.value.companyEmail) {
      errors.value.companyEmail = "Company email is required";
    }
    if (!form.value.companyAddress) {
      errors.value.companyAddress = "Company address is required";
    }
    if (!form.value.ssmNumber) {
      errors.value.ssmNumber = "SSM number is required";
    }
    if (!form.value.logoUrl) {
      errors.value.logoUrl = "Company logo is required";
    }
    if (!form.value.wazeUrl) {
      errors.value.wazeUrl = "Waze URL is required";
    }
    if (!form.value.googleMapsUrl) {
      errors.value.googleMapsUrl = "Google Maps URL is required";
    }

    // Bank details validation
    if (!form.value.bankQrCode) {
      errors.value.bankQrCode = "Bank QR code is required";
    }
    if (!form.value.bankName) {
      errors.value.bankName = "Bank name is required";
    }
    if (!form.value.bankAccountNo) {
      errors.value.bankAccountNo = "Bank account number is required";
    }
    if (!form.value.bankAccountHolder) {
      errors.value.bankAccountHolder = "Bank account holder name is required";
    }

    if (Object.keys(errors.value).length > 0) {
      return;
    }

    isLoading.value = true;
    const response = (await $apiFetch("/api/setting/update-organization", {
      method: "POST",
      body: {
        companyName: form.value.companyName,
        companyEmail: form.value.companyEmail,
        companyAddress: form.value.companyAddress,
        ssmNumber: form.value.ssmNumber,
        logoUrl: form.value.logoUrl,
        wazeUrl: form.value.wazeUrl,
        googleMapsUrl: form.value.googleMapsUrl,
        bankQrCode: form.value.bankQrCode,
        bankName: form.value.bankName,
        bankAccountNo: form.value.bankAccountNo,
        bankAccountHolder: form.value.bankAccountHolder,
      },
    })) as ApiResponse;

    if (response.statusCode === 200) {
      showModal(
        "success",
        "Success",
        "Organization details updated successfully"
      );
    } else {
      showModal(
        "error",
        "Error",
        response.message || "Failed to update organization details"
      );
    }
  } catch (error) {
    const fetchError = error as FetchError;
    console.error(fetchError);
    showModal(
      "error",
      "Error",
      fetchError.message || "Failed to update organization details"
    );
  } finally {
    isLoading.value = false;
  }
}

// Fetch organization details on mount
onMounted(async () => {
  await fetchOrganizationDetails();
});
</script>

<style lang="scss" scoped></style>
