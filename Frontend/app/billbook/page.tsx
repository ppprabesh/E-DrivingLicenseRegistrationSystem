"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function BillBookPage() {
  const router = useRouter();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [searchResult, setSearchResult] = useState<{ id: string; registrationNumber: string; ownerName: string } | null>(
    null
  );
  const [error, setError] = useState("");

  // Mock function to simulate searching for a bill book
  const searchBillBook = async () => {
    // Replace this with your actual API call
    const mockData = [
      { id: "1", registrationNumber: "12345", ownerName: "John Doe" },
      { id: "2", registrationNumber: "67890", ownerName: "Jane Smith" },
    ];

    const result = mockData.find((item) => item.registrationNumber === registrationNumber);

    if (result) {
      setSearchResult(result);
      setError("");
    } else {
      setSearchResult(null);
      setError("No bill book found with the provided registration number.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Bill Book Management</h1>
     

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-blue-600">Search for a Bill Book</CardTitle>
          <CardDescription>Enter the registration number to find an existing bill book.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter registration number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            <Button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={searchBillBook}>
              <Search className="mr-2  h-4 w-4 " />
              Search
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {searchResult && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <p className="font-semibold">Bill Book Found:</p>
              <p>Registration Number: {searchResult.registrationNumber}</p>
              <p>Owner Name: {searchResult.ownerName}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Register New Bill Book Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Register a New Bill Book</CardTitle>
          <CardDescription>Click the button below to register a new bill book.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => router.push("/billbook/registration")}>Register a Bill Book</Button>
        </CardContent>
      </Card>
    </div>
  );
}