"use client";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import Cookies from 'js-cookie';

type User = {
  id: number;
  username?: string;
  email?: string;
  admin: boolean;
};

type AuthStore = {
  user: User | null;
  jwt: string | null;
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  jwt: null,
  isLoggedIn: false,

  signIn: async (email, password) => {
    const router = useRouter();

    try {
      const res = await axios.post('/api/login', { email, password });
      const { user, jwt } = res.data;

      set({
        user,
        jwt,
        isLoggedIn: true,
      });

      Cookies.set('user', JSON.stringify(user), { expires: 1 });
      Cookies.set('token', jwt, { expires: 1 });

      toast.success("Successfully signed in!");
      router.push("/");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || "An error occurred while signing in to your account. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  },

  signUp: async (username, email, password) => {
    const router = useRouter();

    try {
      const res = await axios.post('/api/register', { username, email, password });
      const { user, jwt } = res.data;

      set({
        user,
        jwt,
        isLoggedIn: true,
      });

      Cookies.set('user', JSON.stringify(user), { expires: 1 });
      Cookies.set('token', jwt, { expires: 1 });

      toast.success("Welcome! Your account has been created successfully.");
      router.push("/");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || "An error occurred while creating your account. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      jwt: null,
      isLoggedIn: false,
    });
    Cookies.remove('user');
    Cookies.remove('token');
    toast.success("Successfully logged out!");
  },
}));