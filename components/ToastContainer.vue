<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="toastClasses(toast.type)"
        class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-slide-up cursor-pointer"
        @click="dismiss(toast.id)"
      >
        <Icon :name="toastIcon(toast.type)" class="w-5 h-5 flex-shrink-0" />
        <span class="text-sm font-medium">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from '~/types'

const { toasts, dismiss } = useToast()

function toastClasses(type: ToastType) {
  const map: Record<ToastType, string> = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-primary-600 text-white',
    warning: 'bg-amber-500 text-white',
  }
  return map[type]
}

function toastIcon(type: ToastType) {
  const map: Record<ToastType, string> = {
    success: 'ph:check-circle-fill',
    error: 'ph:x-circle-fill',
    info: 'ph:info-fill',
    warning: 'ph:warning-fill',
  }
  return map[type]
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
