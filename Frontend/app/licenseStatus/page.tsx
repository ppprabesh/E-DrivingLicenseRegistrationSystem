"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import WrittenExamForm from "@/components/WrittenExamForm";
import TrialExamForm from "@/components/TrailExamForm";

// Define a type for the user object
type User = {
  isRegistered: boolean;
  isBiometricPassed: boolean;
  isMedicalPassed: boolean;
  isWrittenExamPassed: boolean;
  isTrailExamPassed: boolean;
  isLicenseIssued: boolean;
  writtenExamAppointmentDate: { day: Date; time: string } | null;
  trailExamAppointmentDate: { day: Date; time: string } | null;
};

// Define a dummy user object
const dummyUser: User = {
  isRegistered: true,
  isBiometricPassed: true,
  isMedicalPassed: true,
  isWrittenExamPassed: false,
  isTrailExamPassed: false,
  isLicenseIssued: false,
  writtenExamAppointmentDate: null,
  trailExamAppointmentDate: null,
};

const LicenseStatusPage = () => {
  const [user, setUser] = useState<User>(dummyUser); // Use dummy user data
  const [loading, setLoading] = useState(false); // No loading needed for dummy data

  // Render status based on user progress
  const renderStatus = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>License Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Registered: {user.isRegistered ? "Yes" : "No"}</p>
          <p>Biometrics: {user.isBiometricPassed ? "Passed" : "Pending"}</p>
          <p>Medical: {user.isMedicalPassed ? "Passed" : "Pending"}</p>
          <p>Written Exam: {user.isWrittenExamPassed ? "Passed" : "Pending"}</p>
          <p>Trial Exam: {user.isTrailExamPassed ? "Passed" : "Pending"}</p>
          <p>License Issued: {user.isLicenseIssued ? "Yes" : "No"}</p>
        </CardContent>
      </Card>
    );
  };

  // Render forms based on user progress
  const renderForms = () => {
    if (!user) return null;

    if (user.isRegistered && user.isBiometricPassed && user.isMedicalPassed && !user.isWrittenExamPassed) {
      return (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Written Exam Appointment</h2>
          <WrittenExamForm
            onAppointmentBooked={(date: Date, time: string, token: number) => {
              // Update user's written exam appointment details
              setUser((prevUser) => ({
                ...prevUser, // Copy all existing properties
                writtenExamAppointmentDate: { day: date, time }, // Update nested property
              }));
              toast({
                title: "Appointment Booked",
                description: `Your written exam is scheduled on ${date.toDateString()} at ${time}. Token: ${token}`,
              });
            }}
          />
        </div>
      );
    }

    if (user.isWrittenExamPassed && !user.isTrailExamPassed) {
      return (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Trial Exam Appointment</h2>
          <TrialExamForm
            onAppointmentBooked={(date: Date, time: string, token: number) => {
              // Update user's trial exam appointment details
              setUser((prevUser) => ({
                ...prevUser, // Copy all existing properties
                trailExamAppointmentDate: { day: date, time }, // Update nested property
              }));
              toast({
                title: "Appointment Booked",
                description: `Your trial exam is scheduled on ${date.toDateString()} at ${time}. Token: ${token}`,
              });
            }}
          />
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">License Status</h1>
      {renderStatus()}
      {renderForms()}
    </div>
  );
};

export default LicenseStatusPage;