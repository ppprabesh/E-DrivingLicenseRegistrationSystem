"use client";

import LicenseRegistrationForm from "@/components/LicenseRegistrationForm";
import Image from "next/image";

export default function LicenseRegistration() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/images/Emblem_of_Nepal.svg" 
          alt="Nepal Emblem" 
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-8">
          Online License Registration
        </h1>
        <LicenseRegistrationForm />
      </div>
    </div>
  );
}
