// components/WrittenExamForm.tsx
"use client";

import { useState, useEffect } from "react";
import { format, addDays, isSaturday } from "date-fns";
import  NepaliDate  from "nepali-date-converter";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Mock token counter (replace with a backend API in production)
let tokenCounter: { [key: string]: number } = {};

interface WrittenExamFormProps {
  onAppointmentBooked: (date: Date, time: string, token: number) => void;
}

const WrittenExamForm = ({ onAppointmentBooked }: WrittenExamFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [token, setToken] = useState<number | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>(["11:00 AM", "12:00 PM", "1:00 PM"]);

  // Get current date and calculate the date range for the next 7 days
  const currentDate = new Date();
  const maxDate = addDays(currentDate, 7);

  // Convert selected date to Nepali date
  const nepaliDate = selectedDate ? new NepaliDate(selectedDate).format("YYYY-MM-DD") : "";

  // Disable Saturdays and dates beyond the next 7 days
  const isDateDisabled = (date: Date) => {
    return isSaturday(date) || date > maxDate || date < currentDate;
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDateDisabled(date)) {
      setSelectedDate(date);
      setSelectedTime("");
      setToken(null);
    }
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      const key = `${format(selectedDate, "yyyy-MM-dd")}-${time}`;
      if (tokenCounter[key] >= 50) {
        toast({
          title: "Seats Full",
          description: "Please select another appointment time.",
          variant: "destructive",
        });
      } else {
        setSelectedTime(time);
        const newToken = (tokenCounter[key] || 0) + 1;
        tokenCounter[key] = newToken;
        setToken(newToken);
        onAppointmentBooked(selectedDate, time, newToken); // Call the callback
        toast({
          title: "Appointment Booked",
          description: `Your token number is ${newToken}.`,
        });
      }
    }
  };

  // Reset token counter daily
  useEffect(() => {
    const interval = setInterval(() => {
      tokenCounter = {};
    }, 24 * 60 * 60 * 1000); // Reset every 24 hours
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6">Written Exam Appointment</h2>

      <div className="space-y-4">
        {/* Date Picker */}
        <div>
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border mt-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            Nepali Date: {nepaliDate}
          </p>
        </div>

        {/* Time Picker */}
        <div>
          <Label>Select Time</Label>
          <Select onValueChange={handleTimeSelect} value={selectedTime}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Token Display */}
        {token && (
          <div>
            <Label>Your Token Number</Label>
            <Input value={token} readOnly className="mt-2" />
          </div>
        )}

        {/* Submit Button */}
        <Button
          className="w-full mt-6"
          disabled={!selectedDate || !selectedTime}
          onClick={() => {
            toast({
              title: "Appointment Confirmed",
              description: `Your written exam is booked on ${format(selectedDate!, "yyyy-MM-dd")} at ${selectedTime}.`,
            });
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default WrittenExamForm;