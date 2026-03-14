<template>
  <div class="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2.5">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto flex min-w-[280px] max-w-sm cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-xl"
        :class="styles(t.type)"
        @click="dismiss(t.id)"
      >
        <Icon :name="icons(t.type)" class="h-5 w-5 shrink-0" />
        <span class="text-sm font-medium">{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from '~~/shared/types'

const { toasts, dismiss } = useToast()

function styles(type: ToastType): string {
  const m: Record<ToastType, string> = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200',
    error:   'border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-800 dark:bg-rose-950/80 dark:text-rose-200',
    info:    'border-accent-200 bg-accent-50/90 text-accent-800 dark:border-accent-800 dark:bg-accent-950/80 dark:text-accent-200',
    warning: 'border-amber-200 bg-amber-50/90 text-amber-800 dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-200',
  }
  return m[type]
}

function icons(type: ToastType): string {
  const m: Record<ToastType, string> = {
    success: 'ph:check-circle-fill',
    error: 'ph:x-circle-fill',
    info: 'ph:info-fill',
    warning: 'ph:warning-fill',
  }
  return m[type]
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
</style>
