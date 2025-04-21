import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to check if user is in cooldown period
export const isInCooldown = (failedAt: string | null): boolean => {
  if (!failedAt) return false
  const failedDate = new Date(failedAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - failedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays < 90 // 3 months cooldown
}

// Helper function to get remaining cooldown days
export const getRemainingCooldownDays = (failedAt: string | null): number => {
  if (!failedAt) return 0
  const failedDate = new Date(failedAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - failedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, 90 - diffDays) // 90 days - days passed
} 