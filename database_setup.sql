-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    citizenship_number TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    license_issued BOOLEAN DEFAULT FALSE,
    failed_at TIMESTAMP WITH TIME ZONE,
    written_exam_status TEXT CHECK (written_exam_status IN ('pending', 'passed', 'failed')),
    physical_exam_status TEXT CHECK (physical_exam_status IN ('pending', 'passed', 'failed')),
    written_exam_date TIMESTAMP WITH TIME ZONE,
    physical_exam_date TIMESTAMP WITH TIME ZONE,
    transport_office TEXT,
    license_categories TEXT[],
    dob TIMESTAMP WITH TIME ZONE
);

-- Create license_registrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS license_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    transport_office TEXT NOT NULL,
    license_categories TEXT[] NOT NULL,
    citizenship_file_url TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT
);

-- Create examination_bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS examination_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_type TEXT CHECK (exam_type IN ('written', 'physical')) NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
    result TEXT CHECK (result IN ('pass', 'fail')),
    marked_by UUID REFERENCES admins(id),
    marked_at TIMESTAMP WITH TIME ZONE,
    score INTEGER,
    remarks TEXT
);

-- Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'super_admin')) DEFAULT 'admin',
    last_login TIMESTAMP WITH TIME ZONE
);

-- Insert default admin users if they don't exist
INSERT INTO admins (name, email, password_hash, role)
VALUES 
    ('Admin User', 'admin@example.com', 'admin123', 'admin'),
    ('Super Admin', 'superadmin@example.com', 'superadmin123', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Temporarily disable RLS for users table to allow signup to work
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Enable RLS on other tables
ALTER TABLE license_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Public can insert users" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can view own registrations" ON license_registrations;
DROP POLICY IF EXISTS "Users can create registrations" ON license_registrations;
DROP POLICY IF EXISTS "Users can view own bookings" ON examination_bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON examination_bookings;
DROP POLICY IF EXISTS "Admins can manage registrations" ON license_registrations;
DROP POLICY IF EXISTS "Admins can manage bookings" ON examination_bookings;

-- Create RLS policies for other tables
-- License registrations policies
CREATE POLICY "Users can view own registrations" ON license_registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create registrations" ON license_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Examination bookings policies
CREATE POLICY "Users can view own bookings" ON examination_bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON examination_bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can manage all registrations and bookings
CREATE POLICY "Admins can manage registrations" ON license_registrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage bookings" ON examination_bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE id = auth.uid()
        )
    );

-- Create policy for admins to access their own data
CREATE POLICY "Admins can access their own data" ON admins
    FOR ALL USING (auth.uid() = id);

-- Create policy for admins to view all data
CREATE POLICY "Admins can view all data" ON admins
    FOR SELECT USING (true);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_license_registrations_updated_at ON license_registrations;
DROP TRIGGER IF EXISTS update_examination_bookings_updated_at ON examination_bookings;
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_license_registrations_updated_at
    BEFORE UPDATE ON license_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_examination_bookings_updated_at
    BEFORE UPDATE ON examination_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all documents" ON storage.objects;

-- Create storage policies
CREATE POLICY "Users can upload their own documents"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'documents' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    );

CREATE POLICY "Users can view their own documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'documents' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    );

CREATE POLICY "Admins can view all documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'documents' AND
        EXISTS (
            SELECT 1 FROM admins
            WHERE id = auth.uid()
        )
    ); 