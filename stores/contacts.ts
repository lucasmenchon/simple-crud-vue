import { defineStore } from 'pinia'
import type { Contact, ContactFormData, SortConfig, SortField, SortDirection } from '~/types'

const STORAGE_KEY = 'scv-contacts'

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref<Contact[]>([])
  const searchQuery = ref('')
  const filterGender = ref<string>('')
  const filterCategory = ref<string>('')
  const filterFavorites = ref(false)
  const sortConfig = ref<SortConfig>({ field: 'name', direction: 'asc' })
  const editingId = ref<number | null>(null)
  const nextId = ref(1)

  // Load from localStorage
  function loadContacts() {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const data = JSON.parse(stored)
          contacts.value = data.contacts || []
          nextId.value = data.nextId || 1
        } catch {
          contacts.value = []
        }
      }
    }
  }

  // Save to localStorage
  function saveContacts() {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        contacts: contacts.value,
        nextId: nextId.value,
      }))
    }
  }

  // Filtered and sorted contacts
  const filteredContacts = computed(() => {
    let result = [...contacts.value]

    // Search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query) ||
        c.notes.toLowerCase().includes(query)
      )
    }

    // Filter by gender
    if (filterGender.value) {
      result = result.filter(c => c.gender === filterGender.value)
    }

    // Filter by category
    if (filterCategory.value) {
      result = result.filter(c => c.category === filterCategory.value)
    }

    // Filter favorites
    if (filterFavorites.value) {
      result = result.filter(c => c.favorite)
    }

    // Sort
    const { field, direction } = sortConfig.value
    result.sort((a, b) => {
      let valA = a[field] ?? ''
      let valB = b[field] ?? ''

      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()

      if (valA < valB) return direction === 'asc' ? -1 : 1
      if (valA > valB) return direction === 'asc' ? 1 : -1
      return 0
    })

    return result
  })

  const totalContacts = computed(() => contacts.value.length)
  const favoriteCount = computed(() => contacts.value.filter(c => c.favorite).length)
  const hasActiveFilters = computed(() =>
    !!searchQuery.value || !!filterGender.value || !!filterCategory.value || filterFavorites.value
  )

  const stats = computed(() => {
    const genderCounts: Record<string, number> = {}
    const categoryCounts: Record<string, number> = {}
    let totalAge = 0
    let ageCount = 0

    contacts.value.forEach(c => {
      if (c.gender) genderCounts[c.gender] = (genderCounts[c.gender] || 0) + 1
      if (c.category) categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1
      if (c.age) { totalAge += c.age; ageCount++ }
    })

    return {
      total: contacts.value.length,
      favorites: favoriteCount.value,
      avgAge: ageCount > 0 ? Math.round(totalAge / ageCount) : 0,
      genderCounts,
      categoryCounts,
    }
  })

  function addContact(formData: ContactFormData) {
    const contact: Contact = {
      ...formData,
      id: nextId.value++,
      favorite: false,
    }
    contacts.value.push(contact)
    saveContacts()
    return contact
  }

  function updateContact(id: number, formData: ContactFormData) {
    const index = contacts.value.findIndex(c => c.id === id)
    if (index !== -1) {
      contacts.value[index] = {
        ...contacts.value[index],
        ...formData,
      }
      saveContacts()
    }
    editingId.value = null
  }

  function removeContact(id: number) {
    contacts.value = contacts.value.filter(c => c.id !== id)
    if (editingId.value === id) editingId.value = null
    saveContacts()
  }

  function toggleFavorite(id: number) {
    const contact = contacts.value.find(c => c.id === id)
    if (contact) {
      contact.favorite = !contact.favorite
      saveContacts()
    }
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

  function startEditing(id: number) {
    editingId.value = id
  }

  function cancelEditing() {
    editingId.value = null
  }

  function getContact(id: number) {
    return contacts.value.find(c => c.id === id)
  }

  function exportContacts(): string {
    return JSON.stringify(contacts.value, null, 2)
  }

  function importContacts(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString)
      if (!Array.isArray(imported)) return false
      const maxId = imported.reduce((max: number, c: Contact) => Math.max(max, c.id || 0), nextId.value)
      nextId.value = maxId + 1
      contacts.value = [...contacts.value, ...imported.map((c: Contact) => ({
        ...c,
        id: c.id || nextId.value++,
      }))]
      saveContacts()
      return true
    } catch {
      return false
    }
  }

  function clearAllContacts() {
    contacts.value = []
    editingId.value = null
    saveContacts()
  }

  return {
    contacts,
    searchQuery,
    filterGender,
    filterCategory,
    filterFavorites,
    sortConfig,
    editingId,
    filteredContacts,
    totalContacts,
    favoriteCount,
    hasActiveFilters,
    stats,
    loadContacts,
    addContact,
    updateContact,
    removeContact,
    toggleFavorite,
    setSort,
    clearFilters,
    startEditing,
    cancelEditing,
    getContact,
    exportContacts,
    importContacts,
    clearAllContacts,
  }
})
