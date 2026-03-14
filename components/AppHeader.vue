<template>
  <header class="sticky top-0 z-40 glass border-b border-surface-200/60 dark:border-surface-800/60">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-purple-500 shadow-lg shadow-accent-500/25">
            <span class="text-sm font-black tracking-tight text-white">SCV</span>
            <div class="absolute inset-0 rounded-xl bg-white/10" />
          </div>
          <div class="hidden sm:block">
            <h1 class="text-base font-bold text-surface-900 dark:text-white leading-tight">
              Simple Crud <span class="text-gradient">Vue</span>
            </h1>
            <p class="text-[11px] font-medium text-surface-400 dark:text-surface-500 -mt-0.5">Contacts Manager</p>
          </div>
        </div>

        <!-- Right -->
        <div class="flex items-center gap-2">
          <!-- Stats pill -->
          <div class="hidden md:flex items-center gap-3 rounded-full bg-surface-100/80 px-4 py-1.5 dark:bg-surface-800/60 text-xs font-semibold text-surface-500 dark:text-surface-400">
            <span class="flex items-center gap-1.5">
              <Icon name="ph:users-bold" class="h-3.5 w-3.5 text-accent-500" />
              {{ store.totalContacts }}
            </span>
            <span class="h-3 w-px bg-surface-300 dark:bg-surface-700" />
            <span class="flex items-center gap-1.5">
              <Icon name="ph:star-fill" class="h-3.5 w-3.5 text-amber-400" />
              {{ store.favoriteCount }}
            </span>
          </div>

          <!-- Color mode -->
          <button
            @click="toggleColor"
            class="flex h-9 w-9 items-center justify-center rounded-xl text-surface-500 transition-all hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200 active:scale-95 cursor-pointer"
            :title="colorMode.value === 'dark' ? 'Light mode' : 'Dark mode'"
          >
            <Transition name="spin" mode="out-in">
              <Icon v-if="colorMode.value === 'dark'" key="sun" name="ph:sun-bold" class="h-[18px] w-[18px]" />
              <Icon v-else key="moon" name="ph:moon-bold" class="h-[18px] w-[18px]" />
            </Transition>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const store = useContactsStore()
const colorMode = useColorMode()

function toggleColor() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style scoped>
.spin-enter-active,
.spin-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.spin-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}
.spin-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}
</style>
