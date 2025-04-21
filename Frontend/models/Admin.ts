import mongoose, { Schema, Document } from 'mongoose';

interface Admin extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
  lastLogin?: Date;
}

const adminSchema = new Schema<Admin>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

export const Admin = mongoose.models.Admin || mongoose.model<Admin>('Admin', adminSchema); 