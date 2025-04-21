export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone_number: string
          citizenship_number: string
          password_hash: string
          license_issued: boolean
          failed_at: string | null
          written_exam_status: 'pending' | 'passed' | 'failed' | null
          physical_exam_status: 'pending' | 'passed' | 'failed' | null
          written_exam_date: string | null
          physical_exam_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone_number: string
          citizenship_number: string
          password_hash: string
          license_issued?: boolean
          failed_at?: string | null
          written_exam_status?: 'pending' | 'passed' | 'failed' | null
          physical_exam_status?: 'pending' | 'passed' | 'failed' | null
          written_exam_date?: string | null
          physical_exam_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone_number?: string
          citizenship_number?: string
          password_hash?: string
          license_issued?: boolean
          failed_at?: string | null
          written_exam_status?: 'pending' | 'passed' | 'failed' | null
          physical_exam_status?: 'pending' | 'passed' | 'failed' | null
          written_exam_date?: string | null
          physical_exam_date?: string | null
        }
      }
      license_registrations: {
        Row: {
          id: string
          created_at: string
          user_id: string
          appointment_date: string
          transport_office: string
          license_categories: string[]
          citizenship_file_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          approved_at: string | null
          rejected_at: string | null
          rejection_reason: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          appointment_date: string
          transport_office: string
          license_categories: string[]
          citizenship_file_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          approved_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          appointment_date?: string
          transport_office?: string
          license_categories?: string[]
          citizenship_file_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          approved_at?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
        }
      }
      examination_bookings: {
        Row: {
          id: string
          created_at: string
          user_id: string
          exam_type: 'written' | 'physical'
          appointment_date: string
          status: 'pending' | 'completed' | 'cancelled'
          result: 'pass' | 'fail' | null
          marked_by: string | null
          marked_at: string | null
          score: number | null
          remarks: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          exam_type: 'written' | 'physical'
          appointment_date: string
          status?: 'pending' | 'completed' | 'cancelled'
          result?: 'pass' | 'fail' | null
          marked_by?: string | null
          marked_at?: string | null
          score?: number | null
          remarks?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          exam_type?: 'written' | 'physical'
          appointment_date?: string
          status?: 'pending' | 'completed' | 'cancelled'
          result?: 'pass' | 'fail' | null
          marked_by?: string | null
          marked_at?: string | null
          score?: number | null
          remarks?: string | null
        }
      }
      admins: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          password_hash: string
          role: 'admin' | 'super_admin'
          last_login: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          password_hash: string
          role?: 'admin' | 'super_admin'
          last_login?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          password_hash?: string
          role?: 'admin' | 'super_admin'
          last_login?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      exam_type: 'written' | 'physical'
      exam_status: 'pending' | 'completed' | 'cancelled'
      exam_result: 'pass' | 'fail'
      admin_role: 'admin' | 'super_admin'
      registration_status: 'pending' | 'approved' | 'rejected'
    }
  }
} 