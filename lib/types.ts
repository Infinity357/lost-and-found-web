export interface LostItem {
  itemId: string
  userId: string
  itemName: string
  description: string
  lostLocation: string | null
  lostDate: string
  imageUrl: string
  founderUserIds: string[]
  isOwner?: boolean
  userName?: string
  userEmail?: string
}

export interface FoundItem {
  itemId: string
  userId: string
  itemName: string
  description: string
  foundLocation: string | null
  foundDate: string
  imageUrl: string
  claimerUserIds: string[]
  isOwner?: boolean
  userName?: string
  userEmail?: string
}

export interface User {
  userId: string
  firstName: string
  lastName: string
  email: string
}

export interface Claim {
  userId: string
  firstName: string
  lastName: string
  email: string
}

export interface LoginResponse {
  userId: string
  firstName: string
  lastName: string
  email: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}
