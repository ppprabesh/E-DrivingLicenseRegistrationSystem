"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// Hardcoded credentials (in a real app, this would be handled differently)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

interface Applicant {
  id: string;
  phoneNumber: string;
  licenseType: string;
  testDate: string;
  status: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  // Mock data (in a real app, this would come from a database)
  const [applicants] = useState<Applicant[]>([
    {
      id: "1",
      phoneNumber: "+977 9841234567",
      licenseType: "MotorBike (A)",
      testDate: "2024-03-20",
      status: "pending",
    },
    // Add more mock data as needed
  ]);

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = (
    id: string,
    status: "pass" | "fail",
    examType: "written" | "physical"
  ) => {
    // In a real app, this would update the database
    toast({
      title: "Status Updated",
      description: `Applicant ${id} has been marked as ${status} for ${examType} exam`,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] relative">
        {/* Login Card */}
        <Card className="w-full max-w-md z-10">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-600">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="focus:ring-blue-600 focus:border-blue-600"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:ring-blue-600 focus:border-blue-600"
            />
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleLogin}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Applicant Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>License Type</TableHead>
                <TableHead>Test Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell>{applicant.phoneNumber}</TableCell>
                  <TableCell>{applicant.licenseType}</TableCell>
                  <TableCell>{applicant.testDate}</TableCell>
                  <TableCell>{applicant.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(applicant.id, "pass", "written")
                        }
                      >
                        Pass
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleStatusUpdate(applicant.id, "fail", "written")
                        }
                      >
                        Fail
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
