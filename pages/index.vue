<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Stats -->
    <StatsCards />

    <!-- Form -->
    <ContactForm />

    <!-- Contact List -->
    <ContactList />
  </div>
</template>

<script setup lang="ts">
const store = useContactsStore()

onMounted(() => {
  store.loadContacts()
})
</script>
