'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserRegistration {
  id: string;
  user_id: string;
  name: string;
  citizenship_number: string;
  appointment_date: string;
  status: string;
  written_exam_status?: string;
  physical_exam_status?: string;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    const checkAdmin = async () => {
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();

      if (adminError || !adminData) {
        toast({
          title: 'Error',
          description: 'Unauthorized access',
          variant: 'destructive',
        });
        router.push('/dashboard');
        return;
      }

      fetchRegistrations();
    };

    checkAdmin();
  }, [user, router, supabase]);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('license_registrations')
        .select(`
          *,
          users (
            written_exam_status,
            physical_exam_status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRegistrations(data.map(reg => ({
        ...reg,
        written_exam_status: reg.users?.written_exam_status,
        physical_exam_status: reg.users?.physical_exam_status,
      })));
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load registrations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, examType: 'written' | 'physical', status: 'passed' | 'failed') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          [`${examType}_exam_status`]: status,
          ...(status === 'failed' && {
            failed_at: new Date().toISOString(),
          }),
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${examType} examination marked as ${status}`,
      });

      fetchRegistrations();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">License Registrations</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Citizenship Number</TableHead>
                <TableHead>Appointment Date</TableHead>
                <TableHead>Written Exam</TableHead>
                <TableHead>Physical Exam</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell>{reg.name}</TableCell>
                  <TableCell>{reg.citizenship_number}</TableCell>
                  <TableCell>
                    {new Date(reg.appointment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={reg.written_exam_status || 'pending'}
                      onValueChange={(value) => 
                        handleStatusUpdate(reg.user_id, 'written', value as 'passed' | 'failed')
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={reg.physical_exam_status || 'pending'}
                      onValueChange={(value) => 
                        handleStatusUpdate(reg.user_id, 'physical', value as 'passed' | 'failed')
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/admin/users/${reg.user_id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 