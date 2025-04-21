"use client";

import { useState, useEffect } from "react";
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
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { nepaliDateConverter } from "@/lib/utils/dateConverter";

// Define the transportation offices data
// Replace this with your actual data import if available
const transportationOffices = [
  "Bagmati Transportation Office, Ekantakuna",
  "Bagmati Transportation Office, Thulobharyang",
  "Koshi Transportation Office, Itahari",
  "Gandaki Transportation Office, Pokhara",
  "Lumbini Transportation Office, Butwal",
  "Sudurpaschim Transportation Office, Dhangadhi",
  "Karnali Transportation Office, Surkhet",
  "Madhesh Transportation Office, Janakpur"
];

// Form Schema
const formSchema = z.object({
  // Applicant Details
  name: z.string().min(2, "Name must be at least 2 characters").nonempty("Name is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  dobBS: z.string().nonempty("Date of Birth (BS) is required"),
  dobAD: z.string().nonempty("Date of Birth (AD) is required"),
  citizenshipNumber: z.string().nonempty("Citizenship Number is required"),
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
  appointmentDate: z.date().optional(),
  transportOffice: z.string().nonempty("Transportation Office is required"),
  licenseCategories: z.array(z.string()).min(1, "At least one license category is required"),
  district: z.string().optional(),
});

export default function LicenseRegistrationForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [sameAddress, setSameAddress] = useState(false);
  const [date, setDate] = useState<Date>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showAgeError, setShowAgeError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sameAsPermanent: false,
      licenseCategories: [],
      permanentAddress: {
        province: "",
        district: "",
        municipality: "",
        wardNo: "",
        tole: ""
      },
      temporaryAddress: {
        province: "",
        district: "",
        municipality: "",
        wardNo: "",
        tole: ""
      }
    },
  });

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user) {
      form.setValue("name", user.name || "");
      form.setValue("citizenshipNumber", user.citizenship_number || "");
      // Add more pre-filled fields as they become available in the user object
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit this form",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    // Calculate age
    const dobAD = new Date(values.dobAD);
    const today = new Date();
    const age = differenceInYears(today, dobAD);

    if (age < 16) {
      setShowAgeError(true);
      return;
    }

    // Validate license categories
    if (values.licenseCategories.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one license category",
        variant: "destructive",
      });
      return;
    }

    try {
      // Store form data in localStorage
      localStorage.setItem('licenseRegistrationData', JSON.stringify(values));
      
      // Redirect to written examination booking
      router.push('/written-examination');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting the form.",
        variant: "destructive",
      });
    }
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

  return (
    <>
      <div className="mb-6 italic text-gray-600">
        *Please provide accurate and genuine information while filling out this form. Any false information may lead to the rejection of your application.*
      </div>
      <Form {...form}>
        <form 
          onSubmit={(e) => {
            console.log('Form submit event triggered');
            form.handleSubmit(onSubmit)(e);
          }} 
          className="space-y-6 w-full"
        >
          {/* Applicant Details Section */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Applicant Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-blue-600">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input {...form.register("name")} placeholder="Enter your full name" />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <RadioGroup 
                  onValueChange={(value) => form.setValue("gender", value as "male" | "female" | "other")} 
                  defaultValue={form.watch("gender")}
                >
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
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                )}
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
                {form.formState.errors.dobBS && (
                  <p className="text-sm text-red-500">{form.formState.errors.dobBS.message}</p>
                )}
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
                {form.formState.errors.dobAD && (
                  <p className="text-sm text-red-500">{form.formState.errors.dobAD.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Citizenship Number <span className="text-red-500">*</span>
                </Label>
                <Input {...form.register("citizenshipNumber")} placeholder="Enter your citizenship number" />
                {form.formState.errors.citizenshipNumber && (
                  <p className="text-sm text-red-500">{form.formState.errors.citizenshipNumber.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Mother's Name <span className="text-red-500">*</span>
                </Label>
                <Input {...form.register("mothersName")} placeholder="Enter your mother's name" />
                {form.formState.errors.mothersName && (
                  <p className="text-sm text-red-500">{form.formState.errors.mothersName.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-blue-600">
                  Father's Name <span className="text-red-500">*</span>
                </Label>
                <Input {...form.register("fathersName")} placeholder="Enter your father's name" />
                {form.formState.errors.fathersName && (
                  <p className="text-sm text-red-500">{form.formState.errors.fathersName.message}</p>
                )}
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
                <Input 
                  {...form.register("transportOffice")} 
                  placeholder="Enter transportation office name" 
                />
                {form.formState.errors.transportOffice && (
                  <p className="text-sm text-red-500">{form.formState.errors.transportOffice.message}</p>
                )}
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
                        id={`category-${category.id}`}
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
                        checked={form.watch("licenseCategories").includes(category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm">{category.name}</Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.licenseCategories && (
                  <p className="text-sm text-red-500">{form.formState.errors.licenseCategories.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
            </Button>
          </div>
        </form>

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