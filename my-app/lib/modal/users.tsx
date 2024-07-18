// lib/models/users.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  fullname: string;
  phone: number;
  identificationNumber: string;
  vehicleType?: string;
  vehicleLicensePlateNumber?: string;
  fuelCode: string; // Add fuel code field
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: Number, required: true },
  identificationNumber: { type: String, required: true },
  vehicleType: { type: String },
  vehicleLicensePlateNumber: { type: String },
  fuelCode: { type: String, required: true }, // Define fuel code field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;

