<template>
  <header class="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <span class="text-white font-bold text-sm">SCV</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">Simple Crud Vue</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">Modern Contacts Manager</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Stats pill -->
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
            <Icon name="ph:users" class="w-4 h-4" />
            <span>{{ store.totalContacts }} contacts</span>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <Icon name="ph:star-fill" class="w-3.5 h-3.5 text-amber-500" />
            <span>{{ store.favoriteCount }}</span>
          </div>

          <!-- Dark mode toggle -->
          <button
            @click="toggleColorMode"
            class="btn btn-ghost !p-2 !rounded-xl"
            :title="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <Icon :name="colorMode.value === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const store = useContactsStore()
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
