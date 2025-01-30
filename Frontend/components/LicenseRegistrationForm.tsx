"use client";

import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, isWithinInterval, isSaturday, differenceInYears } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { nepaliDateConverter } from "@/lib/utils/dateConverter";
import { transporationOffices } from "@/lib/data/locations";

// Form Schema
const formSchema = z.object({
  // Applicant Details
  name: z.string().min(2, "Name must be at least 2 characters").nonempty("Name is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  dobBS: z.string().nonempty("Date of Birth (BS) is required"),
  dobAD: z.string().nonempty("Date of Birth (AD) is required"),
  citizenshipNumber: z.string().nonempty("Citizenship Number is required"),
  citizenshipFile: z.instanceof(File, { message: "Citizenship file is required" }),
  mothersName: z.string().nonempty("Mother's Name is required"),
  fathersName: z.string().nonempty("Father's Name is required"),
  guardianName: z.string().optional(),

  // Address Details
  permanentAddress: z.object({
    province: z.string(),
    district: z.string(),
    municipality: z.string(),
    wardNo: z.string(),
    tole: z.string(),
  }),
  temporaryAddress: z.object({
    province: z.string(),
    district: z.string(),
    municipality: z.string(),
    wardNo: z.string(),
    tole: z.string(),
  }),
  sameAsPermanent: z.boolean(),

  // License Details
  appointmentDate: z.date(),
  transportOffice: z.string().nonempty("Transportation Office is required"),
  licenseCategories: z.array(z.string()),
  district: z.string().nonempty("District is required"),
});

export default function LicenseRegistrationForm() {
  const [sameAddress, setSameAddress] = useState(false);
  const [date, setDate] = useState<Date>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showAgeError, setShowAgeError] = useState(false); // State for age error popup

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sameAsPermanent: false,
      licenseCategories: [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Calculate age
    const dobAD = new Date(values.dobAD);
    const today = new Date();
    const age = differenceInYears(today, dobAD);

    if (age < 16) {
      setShowAgeError(true); // Show error popup if age is less than 16
      return;
    }

    console.log(values); // Proceed with form submission
  };

  const handleDateChange = (type: "BS" | "AD", value: string) => {
    if (type === "BS") {
      form.setValue("dobBS", value);
      const adDate = nepaliDateConverter.BStoAD(value);
      form.setValue("dobAD", adDate);
    } else {
      form.setValue("dobAD", value);
      const bsDate = nepaliDateConverter.ADtoBS(new Date(value));
      form.setValue("dobBS", bsDate);
    }
  };

  function getAllOffices() {
    const allOffices: string[] = [];
    Object.values(transporationOffices).forEach((offices) => {
      allOffices.push(...offices);
    });
    return allOffices.sort(); // Sort alphabetically
  }

  return (
    <>
      <div className="mb-6 italic text-gray-600">
        *Please provide accurate and genuine information while filling out this form. Any false information may lead to the rejection of your application.*
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Applicant Details Section */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Applicant Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-blue-600">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input {...form.register("name")} placeholder="Enter your full name" />
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <RadioGroup onValueChange={(value) => form.setValue("gender", value as any)}>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Date of Birth (BS) <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...form.register("dobBS")}
                  onChange={(e) => handleDateChange("BS", e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Date of Birth (AD) <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...form.register("dobAD")}
                  onChange={(e) => handleDateChange("AD", e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Citizenship Number <span className="text-red-500">*</span>
                </Label>
                <Input {...form.register("citizenshipNumber")} placeholder="Enter your citizenship number" />
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Citizenship File <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm italic text-gray-600 mb-2">Accepted formats: JPG, JPEG, PNG. Maximum file size: 1MB</p>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  placeholder="Upload image file (JPG, PNG, PDF) less than 1MB"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 1024 * 1024) {
                        // 1MB in bytes
                        form.setError("citizenshipFile", {
                          type: "manual",
                          message: "File size must be less than 1MB",
                        });
                        e.target.value = ""; // Reset input
                      } else {
                        form.clearErrors("citizenshipFile");
                        form.setValue("citizenshipFile", file);
                      }
                    }
                  }}
                />
                {form.formState.errors.citizenshipFile && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.citizenshipFile.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Mother's Name <span className="text-red-500">*</span>
                </Label>
                <Input {...form.register("mothersName")} placeholder="Enter your mother's name" />
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Father's Name <span className="text-red-500">*</span>
                </Label>
                <Input {...form.register("fathersName")} placeholder="Enter your father's name" />
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">Guardian's Name</Label>
                <Input {...form.register("guardianName")} placeholder="Enter your guardian's name" />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Address Details</h2>

            {/* Permanent Address */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-blue-600">Permanent Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-blue-600">Province</Label>
                  <Input {...form.register("permanentAddress.province")} placeholder="Enter province" />
                </div>
                <div className="space-y-4">
                  <Label className="text-blue-600">District</Label>
                  <Input {...form.register("permanentAddress.district")} placeholder="Enter district" />
                </div>
                <div className="space-y-4">
                  <Label className="text-blue-600">Municipality</Label>
                  <Input {...form.register("permanentAddress.municipality")} placeholder="Enter municipality" />
                </div>
                <div className="space-y-4">
                  <Label className="text-blue-600">Ward No.</Label>
                  <Input {...form.register("permanentAddress.wardNo")} placeholder="Enter ward number" />
                </div>
                <div className="space-y-4">
                  <Label className="text-blue-600">Tole</Label>
                  <Input {...form.register("permanentAddress.tole")} placeholder="Enter tole" />
                </div>
              </div>
            </div>

            {/* Same as Permanent checkbox */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={sameAddress}
                  onCheckedChange={(checked) => {
                    setSameAddress(checked as boolean);
                    if (checked) {
                      // Copy permanent address to temporary
                      const permanentAddr = form.getValues("permanentAddress");
                      form.setValue("temporaryAddress", permanentAddr);
                    }
                  }}
                />
                <Label>Same as Permanent Address</Label>
              </div>
            </div>

            {/* Temporary Address */}
            <div className={sameAddress ? "opacity-50 pointer-events-none" : ""}>
              <h3 className="text-lg font-medium mb-4 text-blue-600">Temporary Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-blue-600">Province</Label>
                  <Input {...form.register("temporaryAddress.province")} placeholder="Enter province" />
                </div>
                <div className="space-y-4">
                  <Label className="text-blue-600">District</Label>
                  <Input {...form.register("temporaryAddress.district")} placeholder="Enter district" />
                </div>
                <div className="space-y-4">
                  <Label className="text-blue-600">Municipality</Label>
                  <Input {...form.register("temporaryAddress.municipality")} placeholder="Enter municipality" />
                </div>
                <div className="space-y-4">
                  <Label className="text-blue-600">Ward No.</Label>
                  <Input {...form.register("temporaryAddress.wardNo")} placeholder="Enter ward number" />
                </div>
                <div className="space-y-4">
                  <Label className="text-blue-600">Tole</Label>
                  <Input {...form.register("temporaryAddress.tole")} placeholder="Enter tole" />
                </div>
              </div>
            </div>
          </div>

          {/* License Details Section */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">License Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-blue-600">
                  Transportation Office <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {form.watch("transportOffice") || "Select office..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search office..." />
                      <CommandEmpty>No office found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-auto">
                        {getAllOffices().map((office) => (
                          <CommandItem
                            key={office}
                            value={office}
                            onSelect={() => {
                              form.setValue("transportOffice", office);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.watch("transportOffice") === office ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {office}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  License Categories <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "A", name: "Motorcycle and Scooter License (Category A)" },
                    { id: "B", name: "Light Vehicle License (Category B)" },
                    { id: "C", name: "Medium Vehicle License (Category C)" },
                    { id: "D", name: "Heavy Vehicle License (Category D)" },
                    { id: "E", name: "Construction Equipment Vehicle License (Category E)" },
                    { id: "F", name: "Agricultural Vehicle License (Category F)" },
                    { id: "G", name: "Electric Vehicle License (Category G)" },
                  ].map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        onCheckedChange={(checked) => {
                          const currentCategories = form.getValues("licenseCategories");
                          if (checked) {
                            form.setValue("licenseCategories", [...currentCategories, category.id]);
                          } else {
                            form.setValue(
                              "licenseCategories",
                              currentCategories.filter((cat) => cat !== category.id)
                            );
                          }
                        }}
                      />
                      <Label className="text-sm">{category.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Submit Application
            </Button>
          </div>
        </form>

        {/* Confirmation Dialog */}
        

        {/* Age Error Dialog */}
        <Dialog open={showAgeError} onOpenChange={setShowAgeError}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ineligible Applicant</DialogTitle>
              <DialogDescription>
                Applicants must be at least 16 years old to apply for a driving license.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowAgeError(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}