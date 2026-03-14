<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Hero -->
      <div class="animate-fade-in">
        <StatsCards />
      </div>

      <!-- Form -->
      <div class="animate-slide-up" style="animation-delay: 0.05s; animation-fill-mode: both;">
        <ContactForm />
      </div>

      <!-- List -->
      <div class="animate-slide-up" style="animation-delay: 0.1s; animation-fill-mode: both;">
        <ContactList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useContactsStore()
onMounted(() => store.loadContacts())
</script>
