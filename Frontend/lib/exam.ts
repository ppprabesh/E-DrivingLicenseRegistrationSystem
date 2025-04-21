import { supabase } from './supabase'
import { Database } from '@/types/database.types'

type ExamToken = Database['public']['Tables']['exam_tokens']['Row']
type ExamType = Database['public']['Enums']['exam_type']
type ExamStatus = Database['public']['Enums']['exam_status']
type ExamResult = Database['public']['Enums']['exam_result']

export const bookExamToken = async (
  userId: string,
  examType: ExamType,
  appointmentDate: string
) => {
  // Check if user already has a pending token for this exam type
  const { data: existingToken } = await supabase
    .from('exam_tokens')
    .select()
    .eq('user_id', userId)
    .eq('exam_type', examType)
    .eq('status', 'pending')
    .single()

  if (existingToken) {
    throw new Error('You already have a pending appointment for this exam')
  }

  // Create new token
  const { data: token, error } = await supabase
    .from('exam_tokens')
    .insert([
      {
        user_id: userId,
        exam_type: examType,
        appointment_date: appointmentDate,
        status: 'pending',
      },
    ])
    .select()
    .single()

  if (error) throw error

  return token
}

export const getExamTokens = async (userId: string) => {
  const { data: tokens, error } = await supabase
    .from('exam_tokens')
    .select()
    .eq('user_id', userId)
    .order('appointment_date', { ascending: false })

  if (error) throw error

  return tokens
}

export const markExamResult = async (
  tokenId: string,
  adminId: string,
  result: ExamResult
) => {
  const { data: token, error: tokenError } = await supabase
    .from('exam_tokens')
    .update({
      status: 'completed',
      result,
      marked_by: adminId,
    })
    .eq('id', tokenId)
    .select()
    .single()

  if (tokenError) throw tokenError

  // If exam failed, update user's failed_at
  if (result === 'fail') {
    const { error: userError } = await supabase
      .from('users')
      .update({
        failed_at: new Date().toISOString(),
      })
      .eq('id', token.user_id)

    if (userError) throw userError
  }

  return token
}

export const getAvailableSlots = async (examType: ExamType, date: string) => {
  // Get all booked slots for the given date and exam type
  const { data: bookedSlots, error: bookedError } = await supabase
    .from('exam_tokens')
    .select('appointment_date')
    .eq('exam_type', examType)
    .eq('appointment_date', date)
    .eq('status', 'pending')

  if (bookedError) throw bookedError

  // In a real application, you would have a table of available slots
  // and return slots that are not in bookedSlots
  // For now, we'll return a mock list of available slots
  const allSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
  ]

  const bookedTimes = bookedSlots.map(slot => 
    new Date(slot.appointment_date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  )

  return allSlots.filter(slot => !bookedTimes.includes(slot))
}

export const cancelExamToken = async (tokenId: string) => {
  const { data: token, error } = await supabase
    .from('exam_tokens')
    .update({
      status: 'cancelled',
    })
    .eq('id', tokenId)
    .select()
    .single()

  if (error) throw error

  return token
} 