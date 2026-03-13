export interface Contact {
  id: string
  name: string
  email: string
  age: number | null
  phone: string
  gender: 'Male' | 'Female' | 'Other' | ''
  category: 'Personal' | 'Work' | 'Family' | 'Other' | ''
  registerDate: string
  favorite: boolean
  notes: string
}

export type ContactFormData = Omit<Contact, 'id' | 'favorite'>

export type SortField = 'name' | 'email' | 'age' | 'phone' | 'registerDate' | 'category'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

export type ViewMode = 'table' | 'grid'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}
