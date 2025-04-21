"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useSearchParams } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

const userLoginSchema = z.object({
  citizenshipNumber: z.string().min(1, 'Citizenship number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof userLoginSchema | typeof adminLoginSchema>({
    resolver: zodResolver(userLoginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, adminSignIn } = useAuth();
  const searchParams = useSearchParams();
  const isAdminLogin = searchParams.get('admin') === 'true';

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      if (isAdminLogin) {
        const data = {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        };
        // Validate admin form data
        adminLoginSchema.parse(data);
        await adminSignIn(data.email, data.password);
        toast({
          title: 'Success',
          description: 'Welcome back, Admin!',
        });
      } else {
        const data = {
          citizenshipNumber: formData.get('citizenshipNumber') as string,
          password: formData.get('password') as string,
        };
        // Validate user form data
        userLoginSchema.parse(data);
        await signIn(data.citizenshipNumber, data.password);
        toast({
          title: 'Success',
          description: 'Welcome back!',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to login';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid admin credentials')) {
          errorMessage = 'Invalid admin email or password';
        } else if (error.message.includes('Invalid credentials')) {
          errorMessage = 'Invalid citizenship number or password';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/Emblem_of_Nepal.svg" 
          alt="Nepal Emblem" 
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      
      <Card className="w-full max-w-md shadow-lg relative z-10">
        <CardHeader className="space-y-4">
          <div className="flex justify-end">
            <Link 
              href="/signup" 
              className="text-sm text-blue-600 hover:underline"
            >
              Create a new account
            </Link>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-blue-600">
              {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isAdminLogin 
                ? 'Enter your admin credentials to access the admin panel.'
                : 'Sign in to your account to continue.'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {isAdminLogin ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  {...register('email')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="citizenshipNumber" className="block text-sm font-medium text-gray-700">
                  Citizenship Number
                </label>
                <input
                  type="text"
                  id="citizenshipNumber"
                  name="citizenshipNumber"
                  {...register('citizenshipNumber')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Enter your citizenship number"
                  disabled={isLoading}
                />
                {errors.citizenshipNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.citizenshipNumber.message}</p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  {...register('password')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Link 
            href={isAdminLogin ? "/login" : "/login?admin=true"} 
            className="text-sm text-blue-600 hover:underline"
          >
            {isAdminLogin ? 'Login as User' : 'Login as Admin'}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}