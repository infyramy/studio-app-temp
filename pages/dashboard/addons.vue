<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div>
        <h1
          class="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] font-playfair"
        >
          Photography Add-ons
        </h1>
        <p class="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          Manage your photography add-ons and extras
        </p>
      </div>
      <button
        @click="showAddAddonModal = true"
        class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 sm:h-5 sm:w-5 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add New Add-on
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Addons Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
      <div
        v-for="addon in addons"
        :key="addon.id"
        class="bg-white rounded-lg shadow-sm border border-[var(--color-border-primary)] overflow-hidden hover:shadow-md transition-all duration-200"
      >
        <!-- Addon Image -->
        <div class="relative aspect-[16/9] bg-gray-100">
          <img
            v-if="addon.image"
            :src="addon.image"
            :alt="addon.title"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        </div>

        <!-- Addon Content -->
        <div class="p-3 sm:p-4">
          <div class="flex flex-col sm:flex-row justify-between sm:items-start gap-1 sm:gap-0 mb-2">
            <h3 class="text-base sm:text-lg font-medium text-[var(--color-text-primary)]">
              {{ addon.title }}
            </h3>
            <span class="text-sm font-medium text-[var(--color-primary)]">
              {{ formatPrice(addon.price) }}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
            {{ addon.desc }}
          </p>

          <!-- Addon Status and Actions -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <!-- Switch Toggle -->
              <button
                type="button"
                @click="toggleAddonStatus(addon)"
                class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="addon.status == 1 ? 'bg-[var(--color-primary)]' : 'bg-gray-200'"
                role="switch"
                :aria-checked="addon.status == 1"
              >
                <span
                  class="pointer-events-none relative inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="addon.status == 1 ? 'translate-x-4' : 'translate-x-0'"
                />
              </button>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="editAddon(addon)"
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
                Edit
              </button>
              <button
                type="button"
                @click="confirmDelete(addon)"
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Addon Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="showAddAddonModal" as="template">
        <Dialog as="div" @close="closeAddAddonModal" class="relative z-[100]">
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
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    class="text-base sm:text-lg font-medium leading-6 text-[var(--color-text-primary)]"
                  >
                    {{ editingAddon ? "Edit Add-on" : "Add New Add-on" }}
                  </DialogTitle>

                  <form @submit.prevent="saveAddon" class="mt-4 space-y-4">
                    <!-- Addon Title -->
                    <div>
                      <label
                        class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Title
                      </label>
                      <input
                        v-model="addonForm.title"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        placeholder="Enter add-on title"
                      />
                    </div>

                    <!-- Addon Description -->
                    <div>
                      <label
                        class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Description
                      </label>
                      <textarea
                        v-model="addonForm.desc"
                        rows="3"
                        required
                        class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        placeholder="Enter add-on description"
                      ></textarea>
                    </div>

                    <!-- Addon Price -->
                    <div>
                      <label
                        class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Price (MYR)
                      </label>
                      <input
                        v-model.number="addonForm.price"
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        placeholder="Enter price"
                      />
                    </div>

                    <!-- Addon Image URL -->
                    <div>
                      <label
                        class="block text-xs sm:text-sm font-medium text-[var(--color-text-primary)]"
                      >
                        Image URL
                      </label>
                      <input
                        v-model="addonForm.image"
                        type="url"
                        class="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] px-3 py-2 text-xs sm:text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        placeholder="Enter image URL"
                      />
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="closeAddAddonModal"
                        class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        :disabled="isSaving"
                        class="inline-flex justify-center rounded-md border border-transparent bg-[var(--color-primary)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                        :class="{ 'opacity-75 cursor-not-allowed': isSaving }"
                      >
                        {{
                          isSaving
                            ? "Saving..."
                            : editingAddon
                            ? "Update Add-on"
                            : "Add Add-on"
                        }}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>

    <!-- Status Modal -->
    <StatusModal
      :is-open="modalState.isOpen"
      :status="modalState.status"
      :title="modalState.title"
      :message="modalState.message"
      @close="closeModal"
    />

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <TransitionRoot appear :show="showDeleteModal" as="template">
        <Dialog as="div" @close="closeDeleteModal" class="relative z-[100]">
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
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-[var(--color-text-primary)]"
                  >
                    Delete Add-on
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-[var(--color-text-muted)]">
                      Are you sure you want to delete this add-on? This action cannot be undone.
                    </p>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeDeleteModal"
                      class="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      @click="deleteAddon"
                      :disabled="isDeleting"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      :class="{ 'opacity-75 cursor-not-allowed': isDeleting }"
                    >
                      {{ isDeleting ? "Deleting..." : "Delete Add-on" }}
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

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import StatusModal from "~/components/common/StatusModal.vue";

definePageMeta({
  layout: "dashboard",
});

const { $apiFetch } = useNuxtApp();

interface Addon {
  id: number;
  title: string;
  desc: string;
  price: number;
  image?: string;
  status: number;
}

type ModalStatus = "success" | "error";

// Add modal state
const modalState = ref({
  isOpen: false,
  status: "success" as ModalStatus,
  title: "",
  message: "",
});

function showModal(status: ModalStatus, title: string, message: string) {
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

// State
const addons = ref<Addon[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const showAddAddonModal = ref(false);
const isSaving = ref(false);
const editingAddon = ref<Addon | null>(null);
const showDeleteModal = ref(false);
const isDeleting = ref(false);
const addonToDelete = ref<Addon | null>(null);

const addonForm = ref({
  title: "",
  desc: "",
  price: 0,
  image: "",
});

// Methods
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(price);
}

async function fetchAddons() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await $apiFetch("/api/booking/get-all-addons");
    addons.value = response as Addon[];
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    isLoading.value = false;
  }
}

function editAddon(addon: Addon) {
  editingAddon.value = addon;
  addonForm.value = {
    title: addon.title,
    desc: addon.desc,
    price: addon.price,
    image: addon.image || "",
  };
  showAddAddonModal.value = true;
}

async function toggleAddonStatus(addon: Addon) {
  try {
    await $apiFetch(`/api/booking/update-addon-status/${addon.id}`, {
      method: "POST",
      body: JSON.stringify({
        status: addon.status === 1 ? 0 : 1,
      }),
    });

    // Refresh addons list
    showModal("success", "Success", "Add-on status updated successfully");
    await fetchAddons();
  } catch (err) {
    console.error("Error updating addon status:", err);
    showModal("error", "Failed", "Failed to update add-on status");
  }
}

async function saveAddon() {
  isSaving.value = true;
  try {
    const endpoint = editingAddon.value
      ? `/api/booking/update-addon/${editingAddon.value.id}`
      : "/api/booking/create-addon";

    await $apiFetch(endpoint, {
      method: editingAddon.value ? "PUT" : "POST",
      body: JSON.stringify(addonForm.value),
    });

    closeAddAddonModal();
    // Refresh addons list and close modal
    await fetchAddons();
    showModal(
      "success",
      "Success",
      `${editingAddon.value ? "Updated" : "Added"} add-on successfully`
    );
  } catch (err) {
    console.error("Error saving addon:", err);
    showModal(
      "error",
      "Failed",
      `${editingAddon.value ? "Update" : "Add"} add-on failed`
    );
  } finally {
    isSaving.value = false;
  }
}

function closeAddAddonModal() {
  showAddAddonModal.value = false;
  editingAddon.value = null;
  addonForm.value = {
    title: "",
    desc: "",
    price: 0,
    image: "",
  };
}

function confirmDelete(addon: Addon) {
  addonToDelete.value = addon;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  addonToDelete.value = null;
}

async function deleteAddon() {
  if (!addonToDelete.value) return;

  isDeleting.value = true;
  try {
    await $apiFetch(`/api/booking/delete-addon/${addonToDelete.value.id}`, {
      method: "DELETE",
    });

    // Refresh addons list and close modal
    await fetchAddons();
    closeDeleteModal();
    showModal("success", "Success", "Add-on deleted successfully");
  } catch (err) {
    console.error("Error deleting addon:", err);
    showModal("error", "Failed", "Failed to delete add-on");
  } finally {
    isDeleting.value = false;
  }
}

// Lifecycle
onMounted(() => {
  fetchAddons();
});
</script>

<style lang="scss" scoped></style>
