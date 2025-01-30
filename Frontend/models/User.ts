// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface extending mongoose.Document
interface User extends Document {
  name: string;
  email: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  dobBS?: Date;
  dobAD?: Date;
  citizenshipNumber?: string;
  mothersName?: string;
  fathersName?: string;
  guardianName?: string;
  permanentAddress?: {
    province: string;
    district: string;
    municipality: string;
    wardNo: string;
    tole: string;
  };
  temporaryAddress?: {
    province: string;
    district: string;
    municipality: string;
    wardNo: string;
    tole: string;
  };
  transportOffice?: string;
  licenseCategories?: string[];
  writtenExamAppointmentDate?: {
    time: string;
    day: Date;
  };
  trailExamAppointmentDate?: {
    time: string;
    day: Date;
  };
  isRegistered?: boolean;
  isBiometricPassed?: boolean;
  isMedicalPassed?: boolean;
  isWrittenExamPassed?: boolean;
  isTrailExamPassed?: boolean;
  isLicenseIssued?: boolean;
  licenseNumber?: string;
  licenseIssuedDate?: Date;
}

// Mongoose schema definition
const userSchema = new Schema<User>({
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
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function () {
      return this.isRegistered;
    },
  },
  dobBS: {
    type: Date,
    required: function () {
      return this.isRegistered;
    },
  },
  dobAD: {
    type: Date,
    required: function () {
      return this.isRegistered;
    },
  },
  citizenshipNumber: {
    type: String,
    required: function () {
      return this.isRegistered;
    },
  },
  mothersName: {
    type: String,
    required: function () {
      return this.isRegistered;
    },
  },
  fathersName: {
    type: String,
    required: function () {
      return this.isRegistered;
    },
  },
  guardianName: {
    type: String,
    required: false, // Optional
  },
  permanentAddress: {
    province: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    district: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    municipality: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    wardNo: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    tole: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
  },
  temporaryAddress: {
    province: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    district: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    municipality: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    wardNo: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    tole: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
  },
  transportOffice: {
    type: String,
    required: function () {
      return this.isRegistered;
    },
  },
  licenseCategories: {
    type: [String],
    required: function () {
      return this.isRegistered;
    },
  },
  writtenExamAppointmentDate: {
    time: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    day: {
      type: Date,
      required: function () {
        return this.isRegistered;
      },
    },
  },
  trailExamAppointmentDate: {
    time: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
    },
    day: {
      type: Date,
      required: function () {
        return this.isRegistered;
      },
    },
  },
  isRegistered: {
    type: Boolean,
    default: false,
  },
  isBiometricPassed: {
    type: Boolean,
    required: function () {
      return this.isRegistered;
    },
  },
  isMedicalPassed: {
    type: Boolean,
    required: function () {
      return this.isRegistered;
    },
  },
  isWrittenExamPassed: {
    type: Boolean,
    required: function () {
      return this.isBiometricPassed && this.isMedicalPassed;
    },
  },
  isTrailExamPassed: {
    type: Boolean,
    required: function () {
      return this.isWrittenExamPassed;
    },
  },
  isLicenseIssued: {
    type: Boolean,
    required: function () {
      return this.isTrailExamPassed;
    },
  },
  licenseNumber: {
    type: String,
    required: function () {
      return this.isLicenseIssued;
    },
  },
  licenseIssuedDate: {
    type: Date,
    required: function () {
      return this.isLicenseIssued;
    },
  },
});

const User = mongoose.models.User || mongoose.model<User>('User', userSchema);

export default User;