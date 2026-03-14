import { defineStore } from 'pinia'
import type { Contact, ContactFormData, SortConfig, SortField } from '~~/shared/types'

const STORAGE_KEY = 'scv-contacts-v3'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref<Contact[]>([])
  const searchQuery = ref('')
  const filterGender = ref<string>('')
  const filterCategory = ref<string>('')
  const filterFavorites = ref(false)
  const sortConfig = ref<SortConfig>({ field: 'name', direction: 'asc' })
  const editingId = ref<string | null>(null)

  function loadContacts() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) contacts.value = JSON.parse(raw) ?? []
    } catch { /* ignore corrupt data */ }
  }

  function persist() {
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts.value))
  }

  const filteredContacts = computed(() => {
    let result = [...contacts.value]
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.notes.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
      )
    }
    if (filterGender.value) result = result.filter(c => c.gender === filterGender.value)
    if (filterCategory.value) result = result.filter(c => c.category === filterCategory.value)
    if (filterFavorites.value) result = result.filter(c => c.favorite)

    const { field, direction } = sortConfig.value
    result.sort((a, b) => {
      let va: string | number = a[field] ?? ''
      let vb: string | number = b[field] ?? ''
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return direction === 'asc' ? -1 : 1
      if (va > vb) return direction === 'asc' ? 1 : -1
      return 0
    })
    return result
  })

  const totalContacts = computed(() => contacts.value.length)
  const favoriteCount = computed(() => contacts.value.filter(c => c.favorite).length)
  const hasActiveFilters = computed(() =>
    !!searchQuery.value || !!filterGender.value || !!filterCategory.value || filterFavorites.value,
  )

  const stats = computed(() => {
    let totalAge = 0
    let ageCount = 0
    contacts.value.forEach(c => { if (c.age) { totalAge += c.age; ageCount++ } })
    return {
      total: contacts.value.length,
      favorites: favoriteCount.value,
      avgAge: ageCount > 0 ? Math.round(totalAge / ageCount) : 0,
    }
  })

  function addContact(data: ContactFormData) {
    contacts.value.push({ ...data, id: uid(), favorite: false })
    persist()
  }

  function updateContact(id: string, data: ContactFormData) {
    const idx = contacts.value.findIndex(c => c.id === id)
    if (idx !== -1) contacts.value[idx] = { ...contacts.value[idx], ...data }
    editingId.value = null
    persist()
  }

  function removeContact(id: string) {
    contacts.value = contacts.value.filter(c => c.id !== id)
    if (editingId.value === id) editingId.value = null
    persist()
  }

  function toggleFavorite(id: string) {
    const c = contacts.value.find(ct => ct.id === id)
    if (c) { c.favorite = !c.favorite; persist() }
  }

  function setSort(field: SortField) {
    if (sortConfig.value.field === field) {
      sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
      sortConfig.value = { field, direction: 'asc' }
    }
  }

  function clearFilters() {
    searchQuery.value = ''
    filterGender.value = ''
    filterCategory.value = ''
    filterFavorites.value = false
  }

  function startEditing(id: string) { editingId.value = id }
  function cancelEditing() { editingId.value = null }
  function getContact(id: string) { return contacts.value.find(c => c.id === id) }

  function exportContacts(): string {
    return JSON.stringify(contacts.value, null, 2)
  }

  function importContacts(json: string): boolean {
    try {
      const arr = JSON.parse(json)
      if (!Array.isArray(arr)) return false
      const imported: Contact[] = arr.map((c: Partial<Contact>) => ({
        id: uid(),
        name: c.name ?? '',
        email: c.email ?? '',
        age: c.age ?? null,
        phone: c.phone ?? '',
        gender: c.gender ?? '',
        category: c.category ?? '',
        registerDate: c.registerDate ?? new Date().toISOString().split('T')[0],
        favorite: c.favorite ?? false,
        notes: c.notes ?? '',
      }))
      contacts.value.push(...imported)
      persist()
      return true
    } catch { return false }
  }

  function clearAllContacts() {
    contacts.value = []
    editingId.value = null
    persist()
  }

  return {
    contacts, searchQuery, filterGender, filterCategory, filterFavorites,
    sortConfig, editingId, filteredContacts, totalContacts, favoriteCount,
    hasActiveFilters, stats, loadContacts, addContact, updateContact,
    removeContact, toggleFavorite, setSort, clearFilters, startEditing,
    cancelEditing, getContact, exportContacts, importContacts, clearAllContacts,
  }
})
