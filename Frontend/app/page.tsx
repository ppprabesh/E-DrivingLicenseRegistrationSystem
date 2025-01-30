import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
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
            <p className="mb-4">
              Apply for your driving license online. Book your written test and
              start your journey.
            </p>
            <Link href="/license-registration">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Apply Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Bill Book Renewal</h2>
            <p className="mb-4">
              Renew your vehicle's bill book online. Quick and hassle-free
              process.
            </p>
            <Link href="/bill-renewal">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Renew Now
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Latest Updates</h2>
            <p className="mb-4">
              Stay informed about the latest news and updates from the
              department.
            </p>
            <Link href="/updates">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View Updates
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
