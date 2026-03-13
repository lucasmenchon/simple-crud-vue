import type { Toast, ToastType } from '~/types'

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])
  let toastId = 0

  function show(message: string, type: ToastType = 'info', duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function success(message: string) { show(message, 'success') }
  function error(message: string) { show(message, 'error', 5000) }
  function info(message: string) { show(message, 'info') }
  function warning(message: string) { show(message, 'warning', 4000) }

  return { toasts, show, dismiss, success, error, info, warning }
}
