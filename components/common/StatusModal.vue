<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <div class="flex items-center justify-center mb-4">
                <div
                  :class="[
                    'rounded-full p-2',
                    status === 'success'
                      ? 'bg-green-100'
                      : status === 'error'
                      ? 'bg-red-100'
                      : 'bg-blue-100',
                  ]"
                >
                  <CheckIcon
                    v-if="status === 'success'"
                    class="w-6 h-6 text-green-600"
                  />
                  <ExclamationCircleIcon
                    v-else-if="status === 'error'"
                    class="w-6 h-6 text-red-600"
                  />
                  <InformationCircleIcon
                    v-else
                    class="w-6 h-6 text-blue-600"
                  />
                </div>
              </div>

              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-center mb-2"
                :class="[
                  status === 'success'
                    ? 'text-green-900'
                    : status === 'error'
                    ? 'text-red-900'
                    : 'text-gray-900',
                ]"
              >
                {{ title }}
              </DialogTitle>

              <div class="mt-2">
                <p class="text-sm text-gray-500 text-center">
                  {{ message }}
                </p>
              </div>

              <div class="mt-4 flex justify-center">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-200"
                  :class="[
                    status === 'success'
                      ? 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500'
                      : status === 'error'
                      ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                      : 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
                  ]"
                  @click="closeModal"
                >
                  {{ buttonText }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  CheckIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import type { StatusModalProps } from "~/types/modal";

const props = withDefaults(defineProps<StatusModalProps>(), {
  title: "",
  buttonText: "Close",
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const closeModal = () => {
  emit("close");
};
</script>
