import { IUser } from '@/types';
import { Schema } from 'mongoose';

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    photoURL: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'owner', 'agent', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    savedProperties: [{
      type: Schema.Types.ObjectId,
      ref: 'Property',
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries (email already indexed by unique: true)
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// JSON Database is used instead - no MongoDB models needed
export default UserSchema;
