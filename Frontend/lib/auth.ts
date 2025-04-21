"use client"

import { create } from 'zustand'
import { supabase } from './supabase'
import { Database } from '@/types/database.types'

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

type User = Database['public']['Tables']['users']['Row']
type Admin = Database['public']['Tables']['admins']['Row']

export const signUp = async (
  name: string,
  email: string,
  password: string,
  dob: string,
  citizenshipNumber: string,
  phoneNumber: string,
  transportOffice: string,
  licenseCategories: string[]
) => {
  const { data: existingUser } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single()

  if (existingUser) {
    throw new Error('User already exists')
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user?.id,
        name,
        email,
        dob,
        citizenship_number: citizenshipNumber,
        phone_number: phoneNumber,
        transport_office: transportOffice,
        license_categories: licenseCategories,
        license_issued: false,
        failed_at: null,
      },
    ])
    .select()
    .single()

  if (userError) throw userError

  return userData
}

export const signIn = async (email: string, password: string) => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) throw authError

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select()
    .eq('id', authData.user.id)
    .single()

  if (userError) throw userError

  return userData
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: userData, error } = await supabase
    .from('users')
    .select()
    .eq('id', user.id)
    .single()

  if (error) throw error

  return userData
}

export const adminSignIn = async (email: string, password: string) => {
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select()
    .eq('email', email)
    .single()

  if (adminError) throw new Error('Invalid credentials')

  // In a real application, you would hash the password and compare hashes
  if (adminData.password_hash !== password) {
    throw new Error('Invalid credentials')
  }

  // Update last login
  await supabase
    .from('admins')
    .update({ last_login: new Date().toISOString() })
    .eq('id', adminData.id)

  return adminData
}