<template>
  <div class="overflow-hidden rounded-2xl border border-surface-200/60 bg-white/70 backdrop-blur-sm dark:border-surface-800/60 dark:bg-surface-900/50">
    <div class="border-b border-surface-100 bg-surface-50/50 px-6 py-4 dark:border-surface-800/60 dark:bg-surface-900/30">
      <div class="flex items-center justify-between">
        <h2 class="flex items-center gap-2.5 text-base font-bold text-surface-900 dark:text-white">
          <Icon
            :name="isEditing ? 'ph:pencil-line-bold' : 'ph:user-plus-bold'"
            class="h-5 w-5 text-accent-500"
          />
          {{ isEditing ? 'Edit Contact' : 'New Contact' }}
        </h2>
        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200 cursor-pointer"
        >
          <Icon name="ph:x-bold" class="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5 p-6">
      <!-- Row 1 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Name <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="John Doe"
            required
            class="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-600 dark:focus:border-accent-500"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-rose-500">{{ errors.name }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="john@example.com"
            class="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-600 dark:focus:border-accent-500"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-rose-500">{{ errors.email }}</p>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Phone <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="(00) 00000-0000"
            @input="formatPhone"
            class="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 font-mono text-sm text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-600 dark:focus:border-accent-500"
          />
          <p v-if="errors.phone" class="mt-1 text-xs text-rose-500">{{ errors.phone }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Age
          </label>
          <input
            v-model.number="form.age"
            type="number"
            placeholder="25"
            min="0"
            max="150"
            class="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-600 dark:focus:border-accent-500"
          />
        </div>
      </div>

      <!-- Row 3 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Gender
          </label>
          <div class="relative">
            <select
              v-model="form.gender"
              class="w-full cursor-pointer appearance-none rounded-xl border border-surface-200 bg-white px-4 py-2.5 pr-10 text-sm text-surface-900 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-accent-500"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <Icon name="ph:caret-down-bold" class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-400" />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Category
          </label>
          <div class="relative">
            <select
              v-model="form.category"
              class="w-full cursor-pointer appearance-none rounded-xl border border-surface-200 bg-white px-4 py-2.5 pr-10 text-sm text-surface-900 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-accent-500"
            >
              <option value="">Select...</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Family">Family</option>
              <option value="Other">Other</option>
            </select>
            <Icon name="ph:caret-down-bold" class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-400" />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Date
          </label>
          <input
            v-model="form.registerDate"
            type="date"
            class="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:focus:border-accent-500"
          />
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          Notes
        </label>
        <textarea
          v-model="form.notes"
          rows="2"
          placeholder="Additional notes..."
          class="w-full resize-none rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-600 dark:focus:border-accent-500"
        />
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 pt-1">
        <button
          type="submit"
          :disabled="!isFormValid"
          class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent-500/25 transition-all hover:shadow-accent-500/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none active:scale-[0.98] sm:flex-none cursor-pointer dark:focus:ring-offset-surface-900"
        >
          <Icon :name="isEditing ? 'ph:floppy-disk-bold' : 'ph:plus-bold'" class="h-4 w-4" />
          {{ isEditing ? 'Save Changes' : 'Add Contact' }}
        </button>
        <button
          type="button"
          @click="resetForm"
          class="inline-flex items-center gap-2 rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-semibold text-surface-600 transition-all hover:bg-surface-100 hover:text-surface-800 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200 active:scale-[0.98] cursor-pointer"
        >
          <Icon name="ph:eraser-bold" class="h-4 w-4" />
          Clear
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { ContactFormData } from '~/types'

const store = useContactsStore()
const toast = useToast()

const emptyForm = (): ContactFormData => ({
  name: '',
  email: '',
  age: null,
  phone: '',
  gender: '',
  category: '',
  registerDate: new Date().toISOString().split('T')[0],
  notes: '',
})

const form = ref<ContactFormData>(emptyForm())
const errors = ref<Record<string, string>>({})
const isEditing = computed(() => store.editingId !== null)

watch(() => store.editingId, (id) => {
  if (id !== null) {
    const c = store.getContact(id)
    if (c) form.value = { name: c.name, email: c.email, age: c.age, phone: c.phone, gender: c.gender, category: c.category, registerDate: c.registerDate, notes: c.notes }
  }
})

const isPhoneValid = computed(() => {
  if (!form.value.phone) return false
  return form.value.phone.replace(/\D/g, '').length >= 10
})

const isFormValid = computed(() => form.value.name.trim().length > 0 && isPhoneValid.value)

function validate(): boolean {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Name is required'
  if (!form.value.phone.trim()) errors.value.phone = 'Phone is required'
  else if (!isPhoneValid.value) errors.value.phone = 'Enter a valid phone number'
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Enter a valid email'
  return Object.keys(errors.value).length === 0
}

function formatPhone(event: Event) {
  const input = event.target as HTMLInputElement
  let v = input.value.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  if (v.length > 6) form.value.phone = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`
  else if (v.length > 2) form.value.phone = `(${v.slice(0, 2)}) ${v.slice(2)}`
  else if (v.length > 0) form.value.phone = `(${v}`
}

function handleSubmit() {
  if (!validate()) return
  if (isEditing.value && store.editingId) {
    store.updateContact(store.editingId, form.value)
    toast.success('Contact updated!')
  } else {
    store.addContact(form.value)
    toast.success('Contact added!')
  }
  resetForm()
}

function resetForm() {
  form.value = emptyForm()
  errors.value = {}
  store.cancelEditing()
}

function cancelEdit() {
  resetForm()
  toast.info('Edit cancelled')
}
</script>
