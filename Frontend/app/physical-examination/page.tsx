"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addDays, isSaturday, isBefore, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PhysicalExaminationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [licenseData, setLicenseData] = useState<any>(null);
  const supabaseClient = createClientComponentClient();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user has passed written exam
    const checkWrittenExamStatus = async () => {
      const { data, error } = await supabaseClient
        .from('users')
        .select('written_exam_status')
        .eq('id', user.id)
        .single();

      if (error || !data || data.written_exam_status !== 'passed') {
        toast({
          title: 'Error',
          description: 'You must pass the written examination first',
          variant: 'destructive',
        });
        router.push('/profile');
        return;
      }

      // Get license registration data
      const { data: licenseData, error: licenseError } = await supabaseClient
        .from('license_registrations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (licenseError || !licenseData) {
        toast({
          title: 'Error',
          description: 'License registration not found',
          variant: 'destructive',
        });
        router.push('/license-registration');
        return;
      }

      setLicenseData(licenseData);
    };

    checkWrittenExamStatus();
  }, [user, router, supabaseClient]);

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    const sevenDaysAfterToday = addDays(today, 7);
    
    // Check if date is within the allowed range (7 days after today)
    if (isBefore(date, sevenDaysAfterToday) || isAfter(date, addDays(sevenDaysAfterToday, 7))) {
      return false;
    }

    // Skip Saturdays
    if (isSaturday(date)) {
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!date || !licenseData || !user) {
      toast({
        title: 'Error',
        description: 'Please select a date and ensure all license data is complete',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create examination booking
      const { error: bookingError } = await supabaseClient
        .from('examination_bookings')
        .insert({
          user_id: user.id,
          license_registration_id: licenseData.id,
          exam_type: 'physical',
          exam_date: date.toISOString(),
          status: 'pending'
        });

      if (bookingError) throw bookingError;

      // Update user's physical exam status
      const { error: userError } = await supabaseClient
        .from('users')
        .update({ 
          physical_exam_booked: true,
          physical_exam_status: 'pending',
          physical_exam_date: date.toISOString()
        })
        .eq('id', user.id);

      if (userError) throw userError;

      toast({
        title: 'Success',
        description: 'Physical examination booked successfully for ' + format(date, 'PPP'),
      });

      router.push('/profile');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to book examination',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Physical Examination</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Examination Date</h2>
        <p className="text-sm text-gray-600 mb-4">
          Please select a date 7 days after today (excluding Saturdays)
        </p>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={isDateAvailable}
          className="rounded-md border"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleBooking}
          disabled={!date || isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Booking...' : 'Book Examination'}
        </Button>
      </div>
    </div>
  );
} 