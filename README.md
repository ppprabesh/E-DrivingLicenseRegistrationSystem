# E-Governance Project - Department of Transportation Nepal

This project is an e-governance platform for the Department of Transportation Nepal, allowing users to apply for driving licenses and manage their vehicle documentation online.

## Features

- User registration and authentication
- Admin dashboard for managing applications
- Driving license application and tracking
- Vehicle documentation management
- Online payment integration

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Database Setup

1. Create a new Supabase project
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `database_setup.sql` and run it in the SQL Editor
4. This will create the necessary tables and insert fixed admin credentials

### Fixed Admin Credentials

The system uses fixed admin credentials that are stored in the database. These cannot be created through the application interface.

Default admin accounts:

- Phone: 9841234567, Password: admin123
- Phone: 9847654321, Password: superadmin123

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication Flow

### User Authentication

1. Users sign up with their full name, phone number, citizenship number, email, and password
2. User data is stored in the Supabase database
3. Users log in using their phone number and password

### Admin Authentication

1. Admins log in using fixed credentials stored in the database
2. Admin credentials cannot be created through the application interface
3. Admins have access to the admin dashboard for managing applications

## Security Considerations

- In a production environment, admin passwords should be properly hashed
- Row Level Security (RLS) policies are implemented to protect user data
- User authentication is handled by Supabase Auth

## License

This project is licensed under the MIT License - see the LICENSE file for details.
