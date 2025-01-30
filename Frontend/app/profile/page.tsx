import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


// Dummy user data
const dummyUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'hashedpassword', // Never expose passwords in real apps
  isRegistered: true, // Change this to false to test the unregistered view
  gender: 'male',
  dobBS: new Date('2050-01-01'),
  dobAD: new Date('1993-04-14'),
  citizenshipNumber: '123-456-789',
  mothersName: 'Jane Doe',
  fathersName: 'John Doe Sr.',
  guardianName: 'Uncle Bob',
  permanentAddress: {
    province: 'Province 1',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan',
    wardNo: '10',
    tole: 'New Road',
  },
  temporaryAddress: {
    province: 'Province 1',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan',
    wardNo: '10',
    tole: 'New Road',
  },
  transportOffice: 'Kathmandu Transport Office',
  licenseCategories: ['A', 'B'],
  writtenExamAppointmentDate: {
    time: '10:00 AM',
    day: new Date('2023-12-01'),
  },
  trailExamAppointmentDate: {
    time: '11:00 AM',
    day: new Date('2023-12-15'),
  },
  isBiometricPassed: true,
  isMedicalPassed: true,
  isWrittenExamPassed: true,
  isTrailExamPassed: true,
  isLicenseIssued: true,
  licenseNumber: 'LIC123456',
  licenseIssuedDate: new Date('2023-12-20'),
};

export default function ProfilePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/Emblem_of_Nepal.svg" 
          alt="Nepal Emblem" 
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            {dummyUser.isRegistered ? 'Full Profile' : 'Basic Information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Always show name and email */}
          <div>
            <p className="font-medium">Name</p>
            <p>{dummyUser.name}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p>{dummyUser.email}</p>
          </div>

          {/* Show additional fields if user is registered */}
          {dummyUser.isRegistered && (
            <>
              <div>
                <p className="font-medium">Gender</p>
                <p>{dummyUser.gender}</p>
              </div>
              <div>
                <p className="font-medium">Date of Birth (BS)</p>
                <p>{dummyUser.dobBS.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium">Date of Birth (AD)</p>
                <p>{dummyUser.dobAD.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium">Citizenship Number</p>
                <p>{dummyUser.citizenshipNumber}</p>
              </div>
              <div>
                <p className="font-medium">Mother's Name</p>
                <p>{dummyUser.mothersName}</p>
              </div>
              <div>
                <p className="font-medium">Father's Name</p>
                <p>{dummyUser.fathersName}</p>
              </div>
              {dummyUser.guardianName && (
                <div>
                  <p className="font-medium">Guardian's Name</p>
                  <p>{dummyUser.guardianName}</p>
                </div>
              )}
              <div>
                <p className="font-medium">Permanent Address</p>
                <p>
                  {dummyUser.permanentAddress.province}, {dummyUser.permanentAddress.district},{' '}
                  {dummyUser.permanentAddress.municipality}, Ward No. {dummyUser.permanentAddress.wardNo},{' '}
                  {dummyUser.permanentAddress.tole}
                </p>
              </div>
              <div>
                <p className="font-medium">Temporary Address</p>
                <p>
                  {dummyUser.temporaryAddress.province}, {dummyUser.temporaryAddress.district},{' '}
                  {dummyUser.temporaryAddress.municipality}, Ward No. {dummyUser.temporaryAddress.wardNo},{' '}
                  {dummyUser.temporaryAddress.tole}
                </p>
              </div>
              <div>
                <p className="font-medium">Transport Office</p>
                <p>{dummyUser.transportOffice}</p>
              </div>
              <div>
                <p className="font-medium">License Categories</p>
                <p>{dummyUser.licenseCategories.join(', ')}</p>
              </div>
              <div>
                <p className="font-medium">Written Exam Appointment</p>
                <p>
                  {dummyUser.writtenExamAppointmentDate.day.toLocaleDateString()} at{' '}
                  {dummyUser.writtenExamAppointmentDate.time}
                </p>
              </div>
              <div>
                <p className="font-medium">Trail Exam Appointment</p>
                <p>
                  {dummyUser.trailExamAppointmentDate.day.toLocaleDateString()} at{' '}
                  {dummyUser.trailExamAppointmentDate.time}
                </p>
              </div>
              {dummyUser.isLicenseIssued && (
                <>
                  <div>
                    <p className="font-medium">License Number</p>
                    <p>{dummyUser.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium">License Issued Date</p>
                    <p>{dummyUser.licenseIssuedDate?.toLocaleDateString()}</p>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}