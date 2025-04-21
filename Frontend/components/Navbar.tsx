"use client";

import { Flag, ChevronDown, Menu, LogOut, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import MiddleSection from "./MiddleSection"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, admin, signOut } = useAuth()
  const router = useRouter()

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  const handleLogout = () => {
    signOut()
    router.push('/')
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-24 flex justify-between items-center gap-4">
            <div className="flex gap-4">
              {/* Logo Section */}
              <div className="col-span-3 lg:col-span-2 flex items-center justify-center lg:justify-start">
                <Link href="/" className="block">
                  <img
                    src="/images/Emblem_of_Nepal.svg"
                    alt="Department of Transportation"
                    className="h-14 w-14"
                  />
                </Link>
              </div>

              {/* Middle Section */}
              <div className="col-span-6 lg:col-span-4">
                <MiddleSection />
              </div>
            </div>

            {/* Navigation Section */}
            <div className="col-span-3 lg:col-span-6 flex justify-end">
              <NavbarDesktop navItems={navItems} licenseTypes={licenseTypes} />
              <Button
                variant="ghost"
                className="lg:hidden text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50">
            <nav className="flex flex-col p-4 space-y-4">
              <Link href="/license-registration">
                <Button variant="ghost" className="w-full justify-start hover:text-blue-600 hover:bg-blue-50">
                  E-Driving License Registration
                </Button>
              </Link>
              <Link href="/billbook">
                <Button variant="ghost" className="w-full justify-start hover:text-blue-600 hover:bg-blue-50">
                  E-BillBook
                </Button>
              </Link>
              {user && (
                <Link href="/profile">
                  <Button variant="ghost" className="w-full justify-start hover:text-blue-600 hover:bg-blue-50">
                    My Profile
                  </Button>
                </Link>
              )}
              <Link href="/updates">
                <Button variant="ghost" className="w-full justify-start hover:text-blue-600 hover:bg-blue-50">
                  Latest Updates
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start hover:text-blue-600 hover:bg-blue-50">
                    License Types <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dropdown-content">
                  <Link href="/license-types/category-a" className="w-full">
                    <DropdownMenuItem>Category A - Two Wheelers</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-b" className="w-full">
                    <DropdownMenuItem>Category B - Light Vehicles</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-c" className="w-full">
                    <DropdownMenuItem>Category C - Heavy Vehicles</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-k" className="w-full">
                    <DropdownMenuItem>Category K - Agricultural</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-j" className="w-full">
                    <DropdownMenuItem>Category J - Special Equipment</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-i" className="w-full">
                    <DropdownMenuItem>Category I - International</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types" className="w-full">
                    <DropdownMenuItem>View All Categories</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {admin ? (
                <>
                  <Link href="/admin">
                    <Button variant="ghost" className="w-full justify-start hover:text-blue-600 hover:bg-blue-50">
                      <User className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start hover:text-blue-600 hover:bg-blue-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : user ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:text-blue-600 hover:bg-blue-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link href="/login">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="h-24" />
    </>
  );
};

export default Navbar;
