import type { Toast, ToastType } from '~/types'

const toasts = ref<Toast[]>([])

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration = 3500) {
    const id = uid()
    toasts.value.push({ id, message, type, duration })
    if (duration > 0) setTimeout(() => dismiss(id), duration)
  }

  function dismiss(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (msg: string) => show(msg, 'success')
  const error = (msg: string) => show(msg, 'error', 5000)
  const info = (msg: string) => show(msg, 'info')
  const warning = (msg: string) => show(msg, 'warning', 4000)

  return { toasts, show, dismiss, success, error, info, warning }
}
