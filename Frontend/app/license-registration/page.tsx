"use client"

import LicenseRegistrationForm from "@/components/LicenseRegistrationForm";

export default function LicenseRegistration() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/Emblem_of_Nepal.svg" 
          alt="Nepal Emblem" 
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-8">
           Online License Registration
        </h1>
        <LicenseRegistrationForm />
      </div>
    </div>
  );
}