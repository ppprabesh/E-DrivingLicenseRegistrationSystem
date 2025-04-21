"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'

type User = Database['public']['Tables']['users']['Row']
type Admin = Database['public']['Tables']['admins']['Row']

interface AuthContextType {
  user: User | null
  admin: Admin | null
  isLoading: boolean
  signIn: (citizenshipNumber: string, password: string) => Promise<void>
  adminSignIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    citizenshipNumber: string
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Fetch user data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select()
            .eq('id', session.user.id)
            .single()
          
          if (userError) throw userError
          
          if (userData) {
            setUser(userData)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setAdmin(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (citizenshipNumber: string, password: string) => {
    try {
      // Find user by citizenship number and password
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('citizenship_number', citizenshipNumber)
        .eq('password', password)
        .single()

      if (userError || !userData) {
        console.error('Error finding user:', userError)
        throw new Error('Invalid credentials')
      }

      // Set user in state and establish session
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))

      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Error signing in:', error)
      throw new Error('Invalid credentials')
    }
  }

  const adminSignIn = async (email: string, password: string) => {
    try {
      console.log('Attempting admin login with:', { email })
      
      // Check against admin credentials in the database
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single()

      if (adminError) {
        console.error('Admin lookup error:', {
          message: adminError.message,
          details: adminError.details,
          hint: adminError.hint,
          code: adminError.code
        })
        throw new Error('Invalid admin credentials')
      }

      if (!adminData) {
        console.error('No admin found with email:', email)
        throw new Error('Invalid admin credentials')
      }

      // Compare password directly since we're storing it as plain text for now
      if (adminData.password_hash !== password) {
        console.error('Password mismatch for admin:', email)
        throw new Error('Invalid admin credentials')
      }

      // Update last login timestamp
      const { error: updateError } = await supabase
        .from('admins')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminData.id)

      if (updateError) {
        console.error('Error updating last login:', {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code
        })
      }

      // Set admin in state and establish session
      setAdmin(adminData)
      localStorage.setItem('admin', JSON.stringify(adminData))

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (error) {
      console.error('Error signing in as admin:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Clear user data from state and localStorage
      setUser(null)
      setAdmin(null)
      localStorage.removeItem('user')
      localStorage.removeItem('admin')
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const signUp = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    citizenshipNumber: string
  ) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address')
      }

      // Check if user already exists by citizenship number or phone number
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .or(`citizenship_number.eq.${citizenshipNumber},phone_number.eq.${phoneNumber},email.eq.${email}`)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking user existence:', checkError)
        throw new Error('Error checking user existence')
      }

      if (existingUser) {
        throw new Error('A user with this citizenship number, phone number, or email already exists')
      }

      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        console.error('Error creating auth user:', authError)
        // Provide more specific error message based on the error
        if (authError.message.includes('invalid')) {
          throw new Error('Invalid email format. Please enter a valid email address.')
        } else {
          throw new Error(`Failed to create user account: ${authError.message}`)
        }
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      // Create user profile in the database with exact schema match
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name,
          email,
          phone_number: phoneNumber,
          citizenship_number: citizenshipNumber,
          password_hash: password,
          license_issued: false,
          written_exam_status: null,
          physical_exam_status: null,
          written_exam_date: null,
          physical_exam_date: null,
          failed_at: null,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (userError) {
        console.error('Error creating user profile:', userError)
        // Log the specific error details
        console.error('Error details:', {
          code: userError.code,
          message: userError.message,
          details: userError.details,
          hint: userError.hint
        })
        throw new Error(`Failed to create user profile: ${userError.message}`)
      }

      if (!userData) {
        throw new Error('Failed to create user profile')
      }

      // Set user in state and establish session
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))

      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  const value = {
    user,
    admin,
    isLoading,
    signIn,
    adminSignIn,
    signOut,
    signUp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 