'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function ExamStatusNotification() {
  const [notification, setNotification] = useState<string | null>(null);
  const [showAction, setShowAction] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user) return;

    const checkExamStatus = async () => {
      const { data: userData, error } = await supabase
        .from('users')
        .select('written_exam_status, physical_exam_status')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching exam status:', error);
        return;
      }

      if (userData?.written_exam_status === 'passed' && !userData?.physical_exam_booked) {
        setNotification('Congratulations! You have passed your written examination. Please book your physical examination.');
        setShowAction(true);
      } else if (userData?.physical_exam_status === 'passed') {
        setNotification('Congratulations! You have passed your physical examination. Please collect your license from the issued office.');
        setShowAction(false);
      } else if (userData?.physical_exam_status === 'failed') {
        setNotification('You have failed your physical examination. Please try again after 1 month.');
        setShowAction(false);
      }
    };

    checkExamStatus();
  }, [user, supabase]);

  if (!notification) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-800">{notification}</p>
        </div>
        {showAction && (
          <Button
            onClick={() => router.push('/physical-examination')}
            className="ml-4"
          >
            Book Physical Examination
          </Button>
        )}
      </div>
    </div>
  );
} 