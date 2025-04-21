"use client";

import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'

interface LicenseRegistration {
  id: string;
  user_id: string;
  name: string;
  gender: string;
  citizenship_number: string;
  transport_office: string;
  license_categories: string[];
  appointment_date: string;
  status: string;
  user: {
    email: string;
    phone_number: string;
  };
  examination_bookings: {
    exam_type: string;
    exam_date: string;
    status: string;
  }[];
}

export default function AdminDashboard() {
  const { admin, signOut } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [registrations, setRegistrations] = useState<LicenseRegistration[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check for stored admin data
    const storedAdmin = localStorage.getItem('admin')
    if (storedAdmin) {
      fetchRegistrations()
      setIsLoading(false)
    } else {
      // Redirect to login if not admin
      router.push('/login?admin=true')
    }
  }, [router])

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('license_registrations')
        .select(`
          *,
          user:users(email, phone_number),
          examination_bookings(exam_type, exam_date, status)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
    } catch (error) {
      console.error('Error fetching registrations:', error)
      toast({
        title: 'Error',
        description: 'Failed to load registrations',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    </div>
  }

  if (!admin) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">License Registrations</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>License Categories</TableHead>
                  <TableHead>Transport Office</TableHead>
                  <TableHead>Appointment Date</TableHead>
                  <TableHead>Written Exam</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">{registration.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{registration.user.email}</div>
                        <div className="text-gray-500">{registration.user.phone_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>{registration.license_categories.join(', ')}</TableCell>
                    <TableCell>{registration.transport_office}</TableCell>
                    <TableCell>
                      {format(new Date(registration.appointment_date), 'PPP')}
                    </TableCell>
                    <TableCell>
                      {registration.examination_bookings?.[0] ? (
                        <div className="text-sm">
                          <div>{format(new Date(registration.examination_bookings[0].exam_date), 'PPP')}</div>
                          {getStatusBadge(registration.examination_bookings[0].status)}
                        </div>
                      ) : (
                        <span className="text-gray-500">Not booked</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(registration.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
