"use client";

import LicenseRegistrationForm from "@/components/LicenseRegistrationForm";

export default function LicenseRegistration() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-8">
          Online License Registration
        </h1>
        <LicenseRegistrationForm />
      </div>
    </div>
  );
}
