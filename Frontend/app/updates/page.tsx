export default function Updates() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Latest Updates</h1>

      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            New Online Services Available
          </h2>
          <p className="text-gray-600 mb-2">Date: March 15, 2024</p>
          <p>
            The Department of Transportation has launched new online services
            for license registration and bill book renewal.
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Holiday Notice</h2>
          <p className="text-gray-600 mb-2">Date: March 10, 2024</p>
          <p>
            The department will be closed for the upcoming festival. Services
            will resume on March 25, 2024.
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Fee Structure Update</h2>
          <p className="text-gray-600 mb-2">Date: March 1, 2024</p>
          <p>
            New fee structure for various services will be effective from April
            1, 2024. Please check the website for details.
          </p>
        </div>
      </div>
    </div>
  );
}
