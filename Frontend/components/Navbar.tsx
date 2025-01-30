"use client"

import { Flag, ChevronDown, Menu } from "lucide-react"
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

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn] = useState(false)

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

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="flex h-24 items-center px-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-4 hover-scale md:flex-1">
            <div className="flex items-center">
              <img src="/images/Emblem_of_Nepal.svg" alt="Department of Transportation" className="h-12 w-12 md:h-14 md:w-14" />
              <div className="hidden md:block">
                <MiddleSection />
              </div>
            </div>
          </Link>

          {/* Center the MiddleSection on mobile */}
          <div className="flex-1 flex justify-center md:hidden">
            <MiddleSection />
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            className="md:hidden text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:ml-auto md:space-x-4">
            <nav className="flex items-center space-x-4 text-blue-600">
              <Link href="/license-registration">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  E-Driving License Registration
                </Button>
              </Link>
              <Link href="/billbook">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  E-BillBook 
                </Button>
              </Link>
              {isLoggedIn && (
                <Link href="/add-category">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    Add Category
                  </Button>
                </Link>
              )}
              <Link href="/updates">
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  Latest Updates
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    License Types <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dropdown-content">
                  <Link href="/license-types/category-a" className="w-full">
                    <DropdownMenuItem className="text-blue-600">Category A - Two Wheelers</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-b" className="w-full">
                    <DropdownMenuItem className="text-blue-600">Category B - Light Vehicles</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-c" className="w-full">
                    <DropdownMenuItem className="text-blue-600">Category C - Heavy Vehicles</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-k" className="w-full">
                    <DropdownMenuItem className="text-blue-600">Category K - Agricultural</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-j" className="w-full">
                    <DropdownMenuItem className="text-blue-600">Category J - Special Equipment</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types/category-i" className="w-full">
                    <DropdownMenuItem className="text-blue-600">Category I - International</DropdownMenuItem>
                  </Link>
                  <Link href="/license-types" className="w-full">
                    <DropdownMenuItem className="text-blue-600">View All Categories</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
              </Link>
            </nav>
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
              {isLoggedIn && (
                <Link href="/add-category">
                  <Button variant="ghost" className="w-full justify-start hover:text-blue-600 hover:bg-blue-50">
                    Add Category
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
              
              <Link href="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
      {/* Adjust spacer height to match new navbar height */}
      <div className="h-24"></div>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar