"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format, addDays, isSaturday, isBefore, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function WrittenExaminationPage() {
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

    // Get license registration data from localStorage
    const storedData = localStorage.getItem('licenseRegistrationData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setLicenseData(parsedData);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load registration data. Please try again.',
          variant: 'destructive',
        });
        router.push('/license-registration');
      }
    } else {
      toast({
        title: 'Error',
        description: 'Registration data not found. Please complete the registration form first.',
        variant: 'destructive',
      });
      router.push('/license-registration');
    }
  }, [user, router]);

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    // Check if date is in the past
    if (isBefore(date, today)) {
      return false;
    }

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

  const handleBack = () => {
    router.push('/license-registration');
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
      // First, update the user's profile with the license registration data
      const { error: userUpdateError } = await supabaseClient
        .from('users')
        .update({
          transport_office: licenseData.transportOffice,
          license_categories: licenseData.licenseCategories,
          written_exam_status: 'pending',
          written_exam_date: date.toISOString()
        })
        .eq('id', user.id);

      if (userUpdateError) {
        console.error('User update error:', userUpdateError);
        throw new Error('Failed to update user profile');
      }

      // Then create the license registration
      const { data: licenseRegistration, error: licenseError } = await supabaseClient
        .from('license_registrations')
        .insert({
          user_id: user.id,
          appointment_date: date.toISOString(),
          transport_office: licenseData.transportOffice,
          license_categories: licenseData.licenseCategories,
          status: 'pending'
        })
        .select()
        .single();

      if (licenseError) {
        console.error('License registration error:', licenseError);
        throw new Error('Failed to create license registration');
      }

      // Create examination booking
      const { error: bookingError } = await supabaseClient
        .from('examination_bookings')
        .insert({
          user_id: user.id,
          license_registration_id: licenseRegistration.id,
          exam_type: 'written',
          appointment_date: date.toISOString(),
          status: 'pending'
        });

      if (bookingError) {
        console.error('Booking error:', bookingError);
        throw new Error('Failed to create examination booking');
      }

      // Clear stored license data
      localStorage.removeItem('licenseRegistrationData');

      // Show success message
      toast({
        title: 'Success',
        description: 'Written examination booked successfully for ' + format(date, 'PPP'),
      });

      // Redirect to profile page
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
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Registration
        </Button>
        <h1 className="text-3xl font-bold">Book Written Examination</h1>
      </div>
      
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