<script setup lang="ts">
import { onMounted } from 'vue'
import { useTitle } from '~/composables/useTitle'

const { updateTitle } = useTitle()

onMounted(async () => {
  await updateTitle()
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  @apply bg-gray-50;
}
</style>
