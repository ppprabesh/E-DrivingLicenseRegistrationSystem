'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  citizenship_number: string;
  written_exam_status: string;
  written_exam_date: string;
  physical_exam_status: string;
  physical_exam_date: string;
  failed_at: string;
  license_registrations: {
    appointment_date: string;
    transport_office: string;
    license_categories: string[];
    citizenship_file_url: string;
  };
}

export default function UserDetailsPage({ params }: { params: { userId: string } }) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
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

      fetchUserDetails();
    };

    checkAdmin();
  }, [user, router, supabase, params.userId]);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          license_registrations (
            appointment_date,
            transport_office,
            license_categories,
            citizenship_file_url
          )
        `)
        .eq('id', params.userId)
        .single();

      if (error) throw error;
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!userDetails) {
    return <div className="container mx-auto px-4 py-8">User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Details</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic user details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{userDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{userDetails.phone_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Citizenship Number</p>
                <p className="font-medium">{userDetails.citizenship_number}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>License Registration</CardTitle>
            <CardDescription>Registration details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Appointment Date</p>
                <p className="font-medium">
                  {new Date(userDetails.license_registrations?.appointment_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transport Office</p>
                <p className="font-medium">{userDetails.license_registrations?.transport_office}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">License Categories</p>
                <p className="font-medium">
                  {userDetails.license_registrations?.license_categories.join(', ')}
                </p>
              </div>
              {userDetails.license_registrations?.citizenship_file_url && (
                <div>
                  <p className="text-sm text-gray-500">Citizenship Document</p>
                  <a
                    href={userDetails.license_registrations.citizenship_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Written Examination</CardTitle>
            <CardDescription>Written exam status and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium capitalize ${
                  userDetails.written_exam_status === 'passed' ? 'text-green-600' :
                  userDetails.written_exam_status === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {userDetails.written_exam_status || 'Not taken'}
                </p>
              </div>
              {userDetails.written_exam_date && (
                <div>
                  <p className="text-sm text-gray-500">Exam Date</p>
                  <p className="font-medium">
                    {new Date(userDetails.written_exam_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Physical Examination</CardTitle>
            <CardDescription>Physical exam status and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium capitalize ${
                  userDetails.physical_exam_status === 'passed' ? 'text-green-600' :
                  userDetails.physical_exam_status === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {userDetails.physical_exam_status || 'Not taken'}
                </p>
              </div>
              {userDetails.physical_exam_date && (
                <div>
                  <p className="text-sm text-gray-500">Exam Date</p>
                  <p className="font-medium">
                    {new Date(userDetails.physical_exam_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {userDetails.failed_at && (
                <div>
                  <p className="text-sm text-gray-500">Last Failed</p>
                  <p className="font-medium">
                    {new Date(userDetails.failed_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 