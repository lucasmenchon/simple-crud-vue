<template>
  <div class="card p-4 sm:p-6">
    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Icon name="ph:address-book-bold" class="w-5 h-5 text-primary-600" />
        Contacts
        <span class="badge badge-blue">{{ store.filteredContacts.length }}</span>
      </h2>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- Search -->
        <div class="relative">
          <Icon name="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="store.searchQuery"
            type="text"
            placeholder="Search..."
            class="input-field !pl-10 !py-2 !text-sm w-48"
          />
        </div>

        <!-- View toggle -->
        <div class="flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
          <button
            @click="viewMode = 'table'"
            :class="viewMode === 'table' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'"
            class="px-3 py-2 transition-colors"
          >
            <Icon name="ph:list-bold" class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'"
            class="px-3 py-2 transition-colors"
          >
            <Icon name="ph:squares-four-bold" class="w-4 h-4" />
          </button>
        </div>

        <!-- Filter toggle -->
        <button @click="showFilters = !showFilters" class="btn btn-ghost btn-sm relative">
          <Icon name="ph:funnel-bold" class="w-4 h-4" />
          <span v-if="store.hasActiveFilters" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-600 rounded-full"></span>
        </button>

        <!-- More actions -->
        <div class="relative" ref="menuRef">
          <button @click="showMenu = !showMenu" class="btn btn-ghost btn-sm">
            <Icon name="ph:dots-three-vertical-bold" class="w-4 h-4" />
          </button>
          <Transition name="menu">
            <div v-if="showMenu" class="absolute right-0 mt-2 w-48 card p-1 z-20 shadow-xl">
              <button @click="handleExport" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Icon name="ph:export-bold" class="w-4 h-4" />
                Export JSON
              </button>
              <button @click="triggerImport" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Icon name="ph:download-bold" class="w-4 h-4" />
                Import JSON
              </button>
              <hr class="my-1 border-gray-200 dark:border-gray-700" />
              <button @click="handleClearAll" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Icon name="ph:trash-bold" class="w-4 h-4" />
                Delete All
              </button>
            </div>
          </Transition>
        </div>
        <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleImport" />
      </div>
    </div>

    <!-- Filters -->
    <Transition name="slide">
      <div v-if="showFilters" class="flex flex-wrap items-center gap-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div class="relative">
          <select v-model="store.filterGender" class="select-field !py-2 !text-sm !pr-8 w-36">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <Icon name="ph:caret-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
        <div class="relative">
          <select v-model="store.filterCategory" class="select-field !py-2 !text-sm !pr-8 w-36">
            <option value="">All Categories</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Family">Family</option>
            <option value="Other">Other</option>
          </select>
          <Icon name="ph:caret-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
        <button
          @click="store.filterFavorites = !store.filterFavorites"
          :class="store.filterFavorites ? 'btn-warning' : 'btn-ghost'"
          class="btn btn-sm"
        >
          <Icon name="ph:star-fill" class="w-4 h-4" />
          Favorites
        </button>
        <button v-if="store.hasActiveFilters" @click="store.clearFilters()" class="btn btn-ghost btn-sm text-red-500">
          <Icon name="ph:x-bold" class="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    </Transition>

    <!-- Empty state -->
    <div v-if="store.filteredContacts.length === 0" class="text-center py-16">
      <Icon name="ph:address-book-thin" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">
        {{ store.totalContacts === 0 ? 'No contacts yet' : 'No contacts match your filters' }}
      </p>
      <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">
        {{ store.totalContacts === 0 ? 'Add your first contact using the form above' : 'Try adjusting your search or filters' }}
      </p>
    </div>

    <!-- Table view -->
    <div v-else-if="viewMode === 'table'" class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8"></th>
            <th
              v-for="col in columns"
              :key="col.field"
              class="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors select-none"
              @click="store.setSort(col.field)"
            >
              <span class="flex items-center gap-1">
                {{ col.label }}
                <Icon
                  v-if="store.sortConfig.field === col.field"
                  :name="store.sortConfig.direction === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                  class="w-3 h-3"
                />
              </span>
            </th>
            <th class="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <TransitionGroup tag="tbody" name="table-row">
          <tr
            v-for="contact in store.filteredContacts"
            :key="contact.id"
            class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20': store.editingId === contact.id }"
          >
            <td class="py-3 px-4">
              <button @click="store.toggleFavorite(contact.id)" class="text-gray-300 dark:text-gray-600 hover:text-amber-500 transition-colors">
                <Icon :name="contact.favorite ? 'ph:star-fill' : 'ph:star'" :class="{ 'text-amber-500': contact.favorite }" class="w-5 h-5" />
              </button>
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" :style="{ background: avatarColor(contact.name) }">
                  {{ contact.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white text-sm">{{ contact.name }}</p>
                  <p v-if="contact.email" class="text-xs text-gray-500 dark:text-gray-400">{{ contact.email }}</p>
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{{ contact.age || '—' }}</td>
            <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{{ contact.phone }}</td>
            <td class="py-3 px-4">
              <span v-if="contact.category" :class="categoryBadge(contact.category)" class="badge">{{ contact.category }}</span>
            </td>
            <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{{ formatDate(contact.registerDate) }}</td>
            <td class="py-3 px-4">
              <div class="flex items-center justify-end gap-1">
                <button @click="store.startEditing(contact.id)" class="btn btn-ghost btn-sm !p-1.5" title="Edit">
                  <Icon name="ph:pencil-simple-bold" class="w-4 h-4 text-primary-600" />
                </button>
                <button @click="confirmDelete(contact)" class="btn btn-ghost btn-sm !p-1.5" title="Delete">
                  <Icon name="ph:trash-bold" class="w-4 h-4 text-red-500" />
                </button>
              </div>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>

    <!-- Grid view -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <TransitionGroup name="grid-card">
        <div
          v-for="contact in store.filteredContacts"
          :key="contact.id"
          class="card p-4 hover:shadow-xl transition-all duration-200 group"
          :class="{ 'ring-2 ring-primary-500': store.editingId === contact.id }"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg" :style="{ background: avatarColor(contact.name) }">
                {{ contact.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ contact.name }}</h3>
                <p v-if="contact.email" class="text-xs text-gray-500 dark:text-gray-400">{{ contact.email }}</p>
              </div>
            </div>
            <button @click="store.toggleFavorite(contact.id)" class="text-gray-300 dark:text-gray-600 hover:text-amber-500 transition-colors">
              <Icon :name="contact.favorite ? 'ph:star-fill' : 'ph:star'" :class="{ 'text-amber-500': contact.favorite }" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <Icon name="ph:phone" class="w-4 h-4" />
              <span class="font-mono">{{ contact.phone }}</span>
            </div>
            <div v-if="contact.age" class="flex items-center gap-2">
              <Icon name="ph:user" class="w-4 h-4" />
              <span>{{ contact.age }} years old &middot; {{ contact.gender || 'Not specified' }}</span>
            </div>
            <div v-if="contact.category" class="flex items-center gap-2">
              <Icon name="ph:tag" class="w-4 h-4" />
              <span :class="categoryBadge(contact.category)" class="badge">{{ contact.category }}</span>
            </div>
            <div v-if="contact.notes" class="flex items-start gap-2 pt-1">
              <Icon name="ph:note" class="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p class="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">{{ contact.notes }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(contact.registerDate) }}</span>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="store.startEditing(contact.id)" class="btn btn-ghost btn-sm !p-1.5">
                <Icon name="ph:pencil-simple-bold" class="w-4 h-4 text-primary-600" />
              </button>
              <button @click="confirmDelete(contact)" class="btn btn-ghost btn-sm !p-1.5">
                <Icon name="ph:trash-bold" class="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="deleteTarget = null">
          <div class="card p-6 max-w-sm w-full animate-scale-in">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <Icon name="ph:warning-fill" class="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white">Delete Contact</h3>
                <p class="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>?
            </p>
            <div class="flex justify-end gap-3">
              <button @click="deleteTarget = null" class="btn btn-secondary">Cancel</button>
              <button @click="executeDelete" class="btn btn-danger">
                <Icon name="ph:trash-bold" class="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Contact, SortField, ViewMode } from '~/types'

const store = useContactsStore()
const toast = useToast()
const viewMode = ref<ViewMode>('table')
const showFilters = ref(false)
const showMenu = ref(false)
const deleteTarget = ref<Contact | null>(null)
const menuRef = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

const columns: { field: SortField; label: string }[] = [
  { field: 'name', label: 'Name' },
  { field: 'age', label: 'Age' },
  { field: 'phone', label: 'Phone' },
  { field: 'category', label: 'Category' },
  { field: 'registerDate', label: 'Date' },
]

function avatarColor(name: string): string {
  const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function categoryBadge(category: string): string {
  const map: Record<string, string> = {
    Personal: 'badge-blue',
    Work: 'badge-purple',
    Family: 'badge-green',
    Other: 'badge-amber',
  }
  return map[category] || 'badge-blue'
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function confirmDelete(contact: Contact) {
  deleteTarget.value = contact
}

function executeDelete() {
  if (deleteTarget.value) {
    store.removeContact(deleteTarget.value.id)
    toast.error(`${deleteTarget.value.name} was deleted`)
    deleteTarget.value = null
  }
}

function handleExport() {
  showMenu.value = false
  const data = store.exportContacts()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `contacts-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('Contacts exported successfully!')
}

function triggerImport() {
  showMenu.value = false
  fileInput.value?.click()
}

function handleImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (store.importContacts(content)) {
      toast.success('Contacts imported successfully!')
    } else {
      toast.error('Failed to import contacts. Invalid file format.')
    }
  }
  reader.readAsText(file)
}

function handleClearAll() {
  showMenu.value = false
  if (store.totalContacts === 0) {
    toast.info('No contacts to delete')
    return
  }
  store.clearAllContacts()
  toast.warning('All contacts deleted')
}

// Close menu on outside click
if (import.meta.client) {
  onMounted(() => {
    document.addEventListener('click', (e) => {
      if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
        showMenu.value = false
      }
    })
  })
}
</script>

<style scoped>
.table-row-enter-active,
.table-row-leave-active {
  transition: all 0.3s ease;
}
.table-row-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.table-row-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.grid-card-enter-active,
.grid-card-leave-active {
  transition: all 0.3s ease;
}
.grid-card-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.grid-card-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-5px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
