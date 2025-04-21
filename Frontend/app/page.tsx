"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/images/Emblem_of_Nepal.svg" 
          alt="Nepal Emblem" 
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {user && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-700">Welcome, {user.name}!</h2>
            <p className="text-gray-600">You are logged in as a user. You can access your profile and manage your license applications.</p>
          </div>
        )}
        
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-12">
          <Image
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa"
            alt="Nepal Transportation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
              Welcome to Department of Transportation
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">License Registration</h2>
              <p className="mb-4">Apply for your driving license online. Book your written test and start your journey.</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                onClick={() => handleNavigate('/license-registration')}
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Bill Book Renewal</h2>
              <p className="mb-4">Renew your vehicle's bill book online. Quick and hassle-free process.</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                onClick={() => handleNavigate('/billbook')}
              >
                Renew Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Latest Updates</h2>
              <p className="mb-4">Stay informed about the latest news and updates from the department.</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                onClick={() => handleNavigate('/updates')}
              >
                View Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}