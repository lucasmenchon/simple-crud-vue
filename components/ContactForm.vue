<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Icon :name="isEditing ? 'ph:pencil-simple-bold' : 'ph:user-plus-bold'" class="w-5 h-5 text-primary-600" />
        {{ isEditing ? 'Edit Contact' : 'New Contact' }}
      </h2>
      <button v-if="isEditing" @click="cancelEdit" class="btn btn-ghost btn-sm">
        <Icon name="ph:x-bold" class="w-4 h-4" />
        Cancel
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Row 1: Name & Email -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="input-field"
            placeholder="Enter full name"
            required
          />
          <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="input-field"
            placeholder="email@example.com"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>
      </div>

      <!-- Row 2: Phone & Age -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Phone <span class="text-red-500">*</span>
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="input-field"
            placeholder="(00) 00000-0000"
            @input="formatPhone"
          />
          <p v-if="errors.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
        </div>
        <div>
          <label for="age" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Age
          </label>
          <input
            id="age"
            v-model.number="form.age"
            type="number"
            class="input-field"
            placeholder="Enter age"
            min="0"
            max="150"
          />
        </div>
      </div>

      <!-- Row 3: Gender, Category, Date -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="gender" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Gender
          </label>
          <div class="relative">
            <select id="gender" v-model="form.gender" class="select-field">
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <Icon name="ph:caret-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Category
          </label>
          <div class="relative">
            <select id="category" v-model="form.category" class="select-field">
              <option value="">Select...</option>
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Family">Family</option>
              <option value="Other">Other</option>
            </select>
            <Icon name="ph:caret-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Registration Date
          </label>
          <input
            id="date"
            v-model="form.registerDate"
            type="date"
            class="input-field"
          />
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Notes
        </label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="2"
          class="input-field resize-none"
          placeholder="Additional notes about this contact..."
        ></textarea>
      </div>

      <!-- Submit buttons -->
      <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="btn btn-primary btn-lg flex-1 sm:flex-none" :disabled="!isFormValid">
          <Icon :name="isEditing ? 'ph:floppy-disk-bold' : 'ph:plus-bold'" class="w-5 h-5" />
          {{ isEditing ? 'Update Contact' : 'Add Contact' }}
        </button>
        <button type="button" @click="resetForm" class="btn btn-secondary">
          <Icon name="ph:eraser-bold" class="w-5 h-5" />
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

// Watch for editing mode changes
watch(() => store.editingId, (id) => {
  if (id !== null) {
    const contact = store.getContact(id)
    if (contact) {
      form.value = {
        name: contact.name,
        email: contact.email,
        age: contact.age,
        phone: contact.phone,
        gender: contact.gender,
        category: contact.category,
        registerDate: contact.registerDate,
        notes: contact.notes,
      }
    }
  }
})

const isFormValid = computed(() => {
  return form.value.name.trim().length > 0 && isPhoneValid.value
})

const isPhoneValid = computed(() => {
  if (!form.value.phone) return false
  const digits = form.value.phone.replace(/\D/g, '')
  return digits.length >= 10
})

function validate(): boolean {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  }

  if (!form.value.phone.trim()) {
    errors.value.phone = 'Phone is required'
  } else if (!isPhoneValid.value) {
    errors.value.phone = 'Please enter a valid phone number'
  }

  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email'
  }

  return Object.keys(errors.value).length === 0
}

function formatPhone(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 11) value = value.slice(0, 11)

  if (value.length > 6) {
    form.value.phone = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
  } else if (value.length > 2) {
    form.value.phone = `(${value.slice(0, 2)}) ${value.slice(2)}`
  } else if (value.length > 0) {
    form.value.phone = `(${value}`
  }
}

function handleSubmit() {
  if (!validate()) return

  if (isEditing.value && store.editingId !== null) {
    store.updateContact(store.editingId, form.value)
    toast.success('Contact updated successfully!')
  } else {
    store.addContact(form.value)
    toast.success('Contact added successfully!')
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
