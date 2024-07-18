// lib/models/users.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  lastName: string;
  documentNumber: string;
  city: string;
  vehicleType?: string;
  vehicleLicensePlateNumber?: string;
  fuelCode: string;
  createdAt: Date;
  updatedAt: Date;
 
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  documentNumber: { type: String, required: true },
  city: { type: String, required: true },
  vehicleType: { type: String },
  vehicleLicensePlateNumber: { type: String },
  fuelCode: { type: String, required: true },
 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;
