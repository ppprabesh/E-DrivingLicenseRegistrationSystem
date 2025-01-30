"use client"

import { create } from 'zustand'

interface User {
  id: string
  phoneNumber: string
  examStatus?: 'pending' | 'written_pass' | 'written_fail' | 'physical_pass' | 'physical_fail'
  writtenTestDate?: string
  physicalTestDate?: string
}

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))