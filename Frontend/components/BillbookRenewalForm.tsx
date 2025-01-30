"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Zod schema for validation
const billBookSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerAddress: z.string().min(1, "Owner address is required"),
  contactNumber: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  engineNumber: z.string().min(1, "Engine number is required"),
  vehicleType: z.enum(["Car", "Motorcycle", "Truck", "Bus"], {
    invalid_type_error: "Select a valid vehicle type",
  }),
  fuelType: z.enum(["Petrol", "Diesel", "Electric"], {
    invalid_type_error: "Select a valid fuel type",
  }),
  registrationDate: z.string().min(1, "Registration date is required"),
});

type BillBookFormValues = z.infer<typeof billBookSchema>;

export default function BillBookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, 
  } = useForm<BillBookFormValues>({
    resolver: zodResolver(billBookSchema),
  });

  const onSubmit = (data: BillBookFormValues) => {
    console.log("Form Data:", data);
    // Add your form submission logic here
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">E-Billbook Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Registration Number */}
          <div>
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              placeholder="Enter registration number"
              {...register("registrationNumber")}
            />
            {errors.registrationNumber && (
              <p className="text-red-500 text-sm">{errors.registrationNumber.message}</p>
            )}
          </div>

          {/* Owner Name */}
          <div>
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input id="ownerName" placeholder="Enter owner name" {...register("ownerName")} />
            {errors.ownerName && (
              <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
            )}
          </div>

          {/* Owner Address */}
          <div>
            <Label htmlFor="ownerAddress">Owner Address</Label>
            <Input id="ownerAddress" placeholder="Enter owner address" {...register("ownerAddress")} />
            {errors.ownerAddress && (
              <p className="text-red-500 text-sm">{errors.ownerAddress.message}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input id="contactNumber" placeholder="Enter contact number" {...register("contactNumber")} />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
            )}
          </div>

          {/* Chassis Number */}
          <div>
            <Label htmlFor="chassisNumber">Chassis Number</Label>
            <Input id="chassisNumber" placeholder="Enter chassis number" {...register("chassisNumber")} />
            {errors.chassisNumber && (
              <p className="text-red-500 text-sm">{errors.chassisNumber.message}</p>
            )}
          </div>

          {/* Engine Number */}
          <div>
            <Label htmlFor="engineNumber">Engine Number</Label>
            <Input id="engineNumber" placeholder="Enter engine number" {...register("engineNumber")} />
            {errors.engineNumber && (
              <p className="text-red-500 text-sm">{errors.engineNumber.message}</p>
            )}
          </div>

          {/* Vehicle Type */}
          <div>
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              onValueChange={(value) => setValue("vehicleType", value as "Car" | "Motorcycle" | "Truck" | "Bus")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Bus">Bus</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicleType && (
              <p className="text-red-500 text-sm">{errors.vehicleType.message}</p>
            )}
          </div>

          {/* Fuel Type */}
          <div>
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select
              onValueChange={(value) => setValue("fuelType", value as "Petrol" | "Diesel" | "Electric")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
              </SelectContent>
            </Select>
            {errors.fuelType && (
              <p className="text-red-500 text-sm">{errors.fuelType.message}</p>
            )}
          </div>

          {/* Registration Date */}
          <div>
            <Label htmlFor="registrationDate">Registration Date</Label>
            <Input
              id="registrationDate"
              type="date"
              {...register("registrationDate")}
            />
            {errors.registrationDate && (
              <p className="text-red-500 text-sm">{errors.registrationDate.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
