<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="group relative overflow-hidden rounded-2xl border border-surface-200/60 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-surface-900/5 dark:border-surface-800/60 dark:bg-surface-900/50 dark:hover:shadow-surface-950/20"
    >
      <!-- Decorative gradient -->
      <div
        class="absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        :class="card.glow"
      />
      <div class="relative">
        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" :class="card.iconBg">
          <Icon :name="card.icon" class="h-5 w-5" :class="card.iconColor" />
        </div>
        <p class="text-2xl font-extrabold tracking-tight text-surface-900 dark:text-white">
          {{ card.value }}
        </p>
        <p class="mt-0.5 text-xs font-medium text-surface-400 dark:text-surface-500">{{ card.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useContactsStore()

const cards = computed(() => [
  {
    label: 'Total Contacts',
    value: store.stats.total,
    icon: 'ph:users-three-bold',
    iconBg: 'bg-accent-100 dark:bg-accent-950/50',
    iconColor: 'text-accent-600 dark:text-accent-400',
    glow: 'bg-accent-500',
  },
  {
    label: 'Favorites',
    value: store.stats.favorites,
    icon: 'ph:heart-bold',
    iconBg: 'bg-rose-100 dark:bg-rose-950/50',
    iconColor: 'text-rose-600 dark:text-rose-400',
    glow: 'bg-rose-500',
  },
  {
    label: 'Average Age',
    value: store.stats.avgAge || '—',
    icon: 'ph:chart-bar-bold',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    glow: 'bg-emerald-500',
  },
  {
    label: 'Showing',
    value: store.filteredContacts.length,
    icon: 'ph:funnel-bold',
    iconBg: 'bg-purple-100 dark:bg-purple-950/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    glow: 'bg-purple-500',
  },
])
</script>
