"use client";

import { FC, useState, useEffect } from "react";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MiddleSection from "./MiddleSection";

interface NavItem {
  href: string;
  label: string;
}

interface NavbarDesktopProps {
  navItems: NavItem[];
  licenseTypes: NavItem[];
}

interface NavbarMobileProps extends NavbarDesktopProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavbarDesktop: FC<NavbarDesktopProps> = ({ navItems, licenseTypes }) => (
  <div className="hidden lg:flex items-center space-x-2">
    {navItems.map((item) => (
      <Link key={item.href} href={item.href}>
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
        >
          {item.label}
        </Button>
      </Link>
    ))}
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
        >
          License Types <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        {licenseTypes.map((type) => (
          <DropdownMenuItem key={type.href} className="cursor-pointer">
            <Link href={type.href} className="w-full text-blue-600">
              {type.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    <Link href="/login">
      <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
        Login
      </Button>
    </Link>
  </div>
);

const NavbarMobile: FC<NavbarMobileProps> = ({
  navItems,
  licenseTypes,
  isOpen,
  onClose,
}) => (
  <>
    {isOpen && (
      <div className="lg:hidden absolute top-24 left-0 right-0 bg-white border-b shadow-lg z-50">
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                {item.label}
              </Button>
            </Link>
          ))}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                License Types <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)]">
              {licenseTypes.map((type) => (
                <DropdownMenuItem key={type.href} className="cursor-pointer">
                  <Link href={type.href} className="w-full">
                    {type.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/login" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Link>
        </nav>
      </div>
    )}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
    )}
  </>
);

const Navbar: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const navItems: NavItem[] = [
    { href: "/license-registration", label: "E-Driving License Registration" },
    { href: "/billbook", label: "E-BillBook" },
    { href: "/updates", label: "Latest Updates" },
  ];

  const licenseTypes: NavItem[] = [
    { href: "/license-types/category-a", label: "Category A - Two Wheelers" },
    { href: "/license-types/category-b", label: "Category B - Light Vehicles" },
    { href: "/license-types/category-c", label: "Category C - Heavy Vehicles" },
    { href: "/license-types/category-k", label: "Category K - Agricultural" },
    {
      href: "/license-types/category-j",
      label: "Category J - Special Equipment",
    },
    { href: "/license-types/category-i", label: "Category I - International" },
    { href: "/license-types", label: "View All Categories" },
  ];

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
        <NavbarMobile
          navItems={navItems}
          licenseTypes={licenseTypes}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Spacer */}
      <div className="h-24" />
    </>
  );
};

export default Navbar;
