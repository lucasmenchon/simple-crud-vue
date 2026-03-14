<template>
  <div class="overflow-hidden rounded-2xl border border-surface-200/60 bg-white/70 backdrop-blur-sm dark:border-surface-800/60 dark:bg-surface-900/50">
    <!-- Toolbar -->
    <div class="flex flex-col gap-4 border-b border-surface-100 bg-surface-50/50 px-6 py-4 dark:border-surface-800/60 dark:bg-surface-900/30 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="flex items-center gap-2.5 text-base font-bold text-surface-900 dark:text-white">
        <Icon name="ph:address-book-bold" class="h-5 w-5 text-accent-500" />
        Contacts
        <span class="ml-1 inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-bold text-accent-700 dark:bg-accent-950/60 dark:text-accent-300">
          {{ store.filteredContacts.length }}
        </span>
      </h2>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Search -->
        <div class="relative">
          <Icon name="ph:magnifying-glass" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            v-model="store.searchQuery"
            type="text"
            placeholder="Search contacts..."
            class="w-52 rounded-xl border border-surface-200 bg-white py-2 pl-10 pr-4 text-sm text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-600 dark:focus:border-accent-500"
          />
        </div>

        <!-- View toggle -->
        <div class="flex overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700">
          <button
            v-for="mode in (['table', 'grid'] as const)"
            :key="mode"
            @click="viewMode = mode"
            class="flex h-9 w-9 items-center justify-center transition-all cursor-pointer"
            :class="viewMode === mode ? 'bg-accent-600 text-white shadow-inner' : 'bg-white text-surface-500 hover:bg-surface-50 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700'"
          >
            <Icon :name="mode === 'table' ? 'ph:list-bold' : 'ph:grid-four-bold'" class="h-4 w-4" />
          </button>
        </div>

        <!-- Filter -->
        <button
          @click="showFilters = !showFilters"
          class="relative flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 text-surface-500 transition-all hover:bg-surface-50 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 cursor-pointer"
        >
          <Icon name="ph:funnel-bold" class="h-4 w-4" />
          <span v-if="store.hasActiveFilters" class="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
          </span>
        </button>

        <!-- Menu -->
        <div class="relative" ref="menuRef">
          <button
            @click="showMenu = !showMenu"
            class="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 text-surface-500 transition-all hover:bg-surface-50 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 cursor-pointer"
          >
            <Icon name="ph:dots-three-vertical-bold" class="h-4 w-4" />
          </button>
          <Transition name="dropdown">
            <div v-if="showMenu" class="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-xl border border-surface-200 bg-white p-1.5 shadow-xl shadow-surface-900/10 dark:border-surface-700 dark:bg-surface-900 dark:shadow-surface-950/30">
              <button @click="handleExport" class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-surface-700 transition-colors hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800 cursor-pointer">
                <Icon name="ph:export-bold" class="h-4 w-4 text-surface-400" />
                Export JSON
              </button>
              <button @click="triggerImport" class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-surface-700 transition-colors hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800 cursor-pointer">
                <Icon name="ph:download-bold" class="h-4 w-4 text-surface-400" />
                Import JSON
              </button>
              <div class="my-1.5 border-t border-surface-100 dark:border-surface-800" />
              <button @click="handleClearAll" class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 cursor-pointer">
                <Icon name="ph:trash-bold" class="h-4 w-4" />
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
      <div v-if="showFilters" class="flex flex-wrap items-center gap-3 border-b border-surface-100 bg-surface-50/80 px-6 py-3 dark:border-surface-800/60 dark:bg-surface-900/40">
        <div class="relative">
          <select v-model="store.filterGender" class="cursor-pointer appearance-none rounded-lg border border-surface-200 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-surface-700 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <Icon name="ph:caret-down-bold" class="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-surface-400" />
        </div>
        <div class="relative">
          <select v-model="store.filterCategory" class="cursor-pointer appearance-none rounded-lg border border-surface-200 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-surface-700 outline-none transition-all focus:border-accent-400 focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300">
            <option value="">All Categories</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Family">Family</option>
            <option value="Other">Other</option>
          </select>
          <Icon name="ph:caret-down-bold" class="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-surface-400" />
        </div>
        <button
          @click="store.filterFavorites = !store.filterFavorites"
          class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
          :class="store.filterFavorites ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-400' : 'border-surface-200 text-surface-500 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800'"
        >
          <Icon name="ph:heart-fill" class="h-3.5 w-3.5" />
          Favorites
        </button>
        <button
          v-if="store.hasActiveFilters"
          @click="store.clearFilters()"
          class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
        >
          <Icon name="ph:x-bold" class="h-3 w-3" />
          Clear
        </button>
      </div>
    </Transition>

    <!-- Empty -->
    <div v-if="store.filteredContacts.length === 0" class="px-6 py-20 text-center">
      <div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800">
        <Icon name="ph:address-book-thin" class="h-10 w-10 text-surface-300 dark:text-surface-600" />
      </div>
      <p class="text-lg font-semibold text-surface-600 dark:text-surface-400">
        {{ store.totalContacts === 0 ? 'No contacts yet' : 'No results found' }}
      </p>
      <p class="mt-1 text-sm text-surface-400 dark:text-surface-500">
        {{ store.totalContacts === 0 ? 'Add your first contact above to get started' : 'Try adjusting your search or filters' }}
      </p>
    </div>

    <!-- Table view -->
    <div v-else-if="viewMode === 'table'" class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-surface-100 dark:border-surface-800">
            <th class="w-12 py-3 pl-6 pr-2" />
            <th
              v-for="col in columns"
              :key="col.field"
              class="cursor-pointer select-none px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-surface-400 transition-colors hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300"
              @click="store.setSort(col.field)"
            >
              <span class="inline-flex items-center gap-1">
                {{ col.label }}
                <Icon
                  v-if="store.sortConfig.field === col.field"
                  :name="store.sortConfig.direction === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                  class="h-3 w-3 text-accent-500"
                />
              </span>
            </th>
            <th class="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">Actions</th>
          </tr>
        </thead>
        <TransitionGroup tag="tbody" name="row">
          <tr
            v-for="contact in store.filteredContacts"
            :key="contact.id"
            class="group border-b border-surface-50 transition-colors hover:bg-accent-50/40 dark:border-surface-800/50 dark:hover:bg-accent-950/20"
            :class="{ 'bg-accent-50/60 dark:bg-accent-950/30': store.editingId === contact.id }"
          >
            <!-- Fav -->
            <td class="py-3 pl-6 pr-2">
              <button @click="store.toggleFavorite(contact.id)" class="text-surface-300 transition-all hover:scale-110 dark:text-surface-600 cursor-pointer" :class="{ '!text-rose-500': contact.favorite }">
                <Icon :name="contact.favorite ? 'ph:heart-fill' : 'ph:heart'" class="h-[18px] w-[18px]" />
              </button>
            </td>
            <!-- Name -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                  :style="{ background: avatarGradient(contact.name) }"
                >
                  {{ contact.name.charAt(0).toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-surface-900 dark:text-white">{{ contact.name }}</p>
                  <p v-if="contact.email" class="truncate text-xs text-surface-400 dark:text-surface-500">{{ contact.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-surface-500 dark:text-surface-400">{{ contact.age || '—' }}</td>
            <td class="px-4 py-3 font-mono text-sm text-surface-500 dark:text-surface-400">{{ contact.phone }}</td>
            <td class="px-4 py-3">
              <span v-if="contact.category" :class="categoryClasses(contact.category)" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                {{ contact.category }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-surface-400 dark:text-surface-500">{{ fmtDate(contact.registerDate) }}</td>
            <td class="px-6 py-3">
              <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button @click="store.startEditing(contact.id)" class="flex h-8 w-8 items-center justify-center rounded-lg text-accent-600 transition-colors hover:bg-accent-50 dark:text-accent-400 dark:hover:bg-accent-950/40 cursor-pointer" title="Edit">
                  <Icon name="ph:pencil-simple-bold" class="h-4 w-4" />
                </button>
                <button @click="confirmDelete(contact)" class="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer" title="Delete">
                  <Icon name="ph:trash-bold" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>

    <!-- Grid view -->
    <div v-else class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      <TransitionGroup name="card">
        <div
          v-for="contact in store.filteredContacts"
          :key="contact.id"
          class="group relative overflow-hidden rounded-xl border border-surface-100 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-surface-900/5 dark:border-surface-800 dark:bg-surface-900/80 dark:hover:shadow-surface-950/20"
          :class="{ 'ring-2 ring-accent-500/50': store.editingId === contact.id }"
        >
          <!-- Header -->
          <div class="mb-4 flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-lg"
                :style="{ background: avatarGradient(contact.name) }"
              >
                {{ contact.name.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <h3 class="truncate text-sm font-bold text-surface-900 dark:text-white">{{ contact.name }}</h3>
                <p v-if="contact.email" class="truncate text-xs text-surface-400 dark:text-surface-500">{{ contact.email }}</p>
              </div>
            </div>
            <button @click="store.toggleFavorite(contact.id)" class="shrink-0 text-surface-300 transition-all hover:scale-110 dark:text-surface-600 cursor-pointer" :class="{ '!text-rose-500': contact.favorite }">
              <Icon :name="contact.favorite ? 'ph:heart-fill' : 'ph:heart'" class="h-5 w-5" />
            </button>
          </div>

          <!-- Details -->
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2.5 text-surface-500 dark:text-surface-400">
              <Icon name="ph:phone" class="h-4 w-4 shrink-0 text-surface-400 dark:text-surface-500" />
              <span class="font-mono text-xs">{{ contact.phone }}</span>
            </div>
            <div v-if="contact.age" class="flex items-center gap-2.5 text-surface-500 dark:text-surface-400">
              <Icon name="ph:user" class="h-4 w-4 shrink-0 text-surface-400 dark:text-surface-500" />
              <span class="text-xs">{{ contact.age }} years &middot; {{ contact.gender || 'N/A' }}</span>
            </div>
            <div v-if="contact.category" class="flex items-center gap-2.5">
              <Icon name="ph:tag" class="h-4 w-4 shrink-0 text-surface-400 dark:text-surface-500" />
              <span :class="categoryClasses(contact.category)" class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold">
                {{ contact.category }}
              </span>
            </div>
            <div v-if="contact.notes" class="flex items-start gap-2.5 pt-1">
              <Icon name="ph:note" class="mt-0.5 h-4 w-4 shrink-0 text-surface-400 dark:text-surface-500" />
              <p class="line-clamp-2 text-xs text-surface-400 dark:text-surface-500">{{ contact.notes }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-4 flex items-center justify-between border-t border-surface-100 pt-3 dark:border-surface-800">
            <span class="text-[11px] text-surface-300 dark:text-surface-600">{{ fmtDate(contact.registerDate) }}</span>
            <div class="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button @click="store.startEditing(contact.id)" class="flex h-7 w-7 items-center justify-center rounded-lg text-accent-600 transition-colors hover:bg-accent-50 dark:text-accent-400 dark:hover:bg-accent-950/40 cursor-pointer">
                <Icon name="ph:pencil-simple-bold" class="h-3.5 w-3.5" />
              </button>
              <button @click="confirmDelete(contact)" class="flex h-7 w-7 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer">
                <Icon name="ph:trash-bold" class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Delete modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="deleteTarget = null">
          <div class="w-full max-w-sm animate-scale-in overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-2xl dark:border-surface-700 dark:bg-surface-900">
            <div class="p-6">
              <div class="mb-4 flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50">
                  <Icon name="ph:warning-fill" class="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 class="font-bold text-surface-900 dark:text-white">Delete Contact</h3>
                  <p class="text-xs text-surface-500">This action cannot be undone</p>
                </div>
              </div>
              <p class="text-sm text-surface-600 dark:text-surface-400">
                Are you sure you want to delete <strong class="text-surface-900 dark:text-white">{{ deleteTarget.name }}</strong>?
              </p>
            </div>
            <div class="flex justify-end gap-2 border-t border-surface-100 bg-surface-50 px-6 py-3 dark:border-surface-800 dark:bg-surface-900/50">
              <button @click="deleteTarget = null" class="cursor-pointer rounded-lg border border-surface-200 px-4 py-2 text-sm font-semibold text-surface-600 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800">Cancel</button>
              <button @click="executeDelete" class="cursor-pointer rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-700 hover:shadow-md">
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

const gradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #ec4899, #f43f5e)',
  'linear-gradient(135deg, #14b8a6, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #84cc16, #22c55e)',
  'linear-gradient(135deg, #f43f5e, #f59e0b)',
]

function avatarGradient(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return gradients[Math.abs(h) % gradients.length]
}

function categoryClasses(cat: string): string {
  const m: Record<string, string> = {
    Personal: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    Work: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
    Family: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    Other: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  }
  return m[cat] || m.Other
}

function fmtDate(d: string): string {
  if (!d) return '—'
  try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return d }
}

function confirmDelete(c: Contact) { deleteTarget.value = c }

function executeDelete() {
  if (deleteTarget.value) {
    store.removeContact(deleteTarget.value.id)
    toast.error(`${deleteTarget.value.name} deleted`)
    deleteTarget.value = null
  }
}

function handleExport() {
  showMenu.value = false
  const blob = new Blob([store.exportContacts()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `contacts-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('Contacts exported!')
}

function triggerImport() { showMenu.value = false; fileInput.value?.click() }

function handleImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    if (store.importContacts(ev.target?.result as string)) toast.success('Contacts imported!')
    else toast.error('Invalid file format')
  }
  reader.readAsText(file)
}

function handleClearAll() {
  showMenu.value = false
  if (store.totalContacts === 0) { toast.info('No contacts to delete'); return }
  store.clearAllContacts()
  toast.warning('All contacts deleted')
}

if (import.meta.client) {
  onMounted(() => {
    document.addEventListener('click', (e: MouseEvent) => {
      if (menuRef.value && !menuRef.value.contains(e.target as Node)) showMenu.value = false
    })
  })
}
</script>

<style scoped>
/* Row transitions */
.row-enter-active, .row-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.row-enter-from { opacity: 0; transform: translateX(-16px); }
.row-leave-to { opacity: 0; transform: translateX(16px); }

/* Card transitions */
.card-enter-active, .card-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.card-enter-from { opacity: 0; transform: scale(0.92); }
.card-leave-to { opacity: 0; transform: scale(0.92); }

/* Slide filter */
.slide-enter-active, .slide-leave-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }

/* Dropdown */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: scale(0.95) translateY(-4px); }

/* Modal */
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
