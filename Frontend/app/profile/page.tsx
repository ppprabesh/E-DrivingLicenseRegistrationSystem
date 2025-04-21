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
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  citizenship_number: string;
  written_exam_status: string;
  physical_exam_status: string;
  license_issued: boolean;
  license_registrations: {
    appointment_date: string;
    transport_office: string;
    license_categories: string[];
  } | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchUserProfile();
  }, [user, router, supabase]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          license_registrations (
            appointment_date,
            transport_office,
            license_categories
          )
        `)
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'passed':
        return <Badge className="bg-green-500">Passed</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto px-4 py-8">Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{profile.phone_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Citizenship Number</p>
                <p className="font-medium">{profile.citizenship_number}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>License Registration Status</CardTitle>
            <CardDescription>Your registration details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Registration Status</p>
                <Badge className={profile.license_registrations ? "bg-green-500" : "bg-red-500"}>
                  {profile.license_registrations ? "Registered" : "Not Registered"}
                </Badge>
              </div>
              {profile.license_registrations && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Appointment Date</p>
                    <p className="font-medium">
                      {new Date(profile.license_registrations.appointment_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transport Office</p>
                    <p className="font-medium">{profile.license_registrations.transport_office}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Categories</p>
                    <p className="font-medium">
                      {profile.license_registrations?.license_categories?.length 
                        ? profile.license_registrations.license_categories.join(', ')
                        : 'No categories selected'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Written Examination</CardTitle>
            <CardDescription>Your written exam status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(profile.written_exam_status)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Physical Examination</CardTitle>
            <CardDescription>Your physical exam status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(profile.physical_exam_status)}
              </div>
              <div>
                <p className="text-sm text-gray-500">License Status</p>
                {profile.physical_exam_status?.toLowerCase() === 'passed' ? (
                  <Badge className="bg-green-500">License Issued</Badge>
                ) : profile.physical_exam_status?.toLowerCase() === 'failed' ? (
                  <Badge className="bg-red-500">Not Issued</Badge>
                ) : (
                  <Badge className="bg-yellow-500">Pending</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex gap-4">
        {!profile.license_registrations && (
          <Button onClick={() => router.push('/license-registration')}>
            Register for License
          </Button>
        )}
        {profile.license_registrations && !profile.written_exam_status && (
          <Button onClick={() => router.push('/written-examination')}>
            Book Written Examination
          </Button>
        )}
        {profile.written_exam_status === 'passed' && !profile.physical_exam_status && (
          <Button onClick={() => router.push('/physical-examination')}>
            Book Physical Examination
          </Button>
        )}
      </div>
    </div>
  );
}