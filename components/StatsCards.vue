<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="card p-4 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
        <Icon name="ph:users-bold" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
      </div>
    </div>

    <div class="card p-4 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
        <Icon name="ph:star-fill" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.favorites }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Favorites</p>
      </div>
    </div>

    <div class="card p-4 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
        <Icon name="ph:calendar-bold" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.avgAge || '—' }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Avg Age</p>
      </div>
    </div>

    <div class="card p-4 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
        <Icon name="ph:funnel-bold" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ filteredCount }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Showing</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useContactsStore()
const stats = computed(() => store.stats)
const filteredCount = computed(() => store.filteredContacts.length)
</script>
