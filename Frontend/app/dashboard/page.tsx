'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ExamStatusNotification from '@/components/ExamStatusNotification';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, router, supabase]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <ExamStatusNotification />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">License Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Written Examination:</p>
              <p className="font-medium">
                {userData?.written_exam_status ? (
                  <span className={`capitalize ${
                    userData.written_exam_status === 'passed' ? 'text-green-600' :
                    userData.written_exam_status === 'failed' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {userData.written_exam_status}
                  </span>
                ) : 'Not taken'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Physical Examination:</p>
              <p className="font-medium">
                {userData?.physical_exam_status ? (
                  <span className={`capitalize ${
                    userData.physical_exam_status === 'passed' ? 'text-green-600' :
                    userData.physical_exam_status === 'failed' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {userData.physical_exam_status}
                  </span>
                ) : 'Not taken'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            {!userData?.written_exam_booked && (
              <Button
                onClick={() => router.push('/written-examination')}
                className="w-full"
              >
                Book Written Examination
              </Button>
            )}
            {userData?.written_exam_status === 'passed' && !userData?.physical_exam_booked && (
              <Button
                onClick={() => router.push('/physical-examination')}
                className="w-full"
              >
                Book Physical Examination
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 