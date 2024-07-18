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

// Validator for alphanumeric fields (only letters and numbers)
const alphanumericValidator = {
  validator: function(v: string) {
    return /^[a-zA-Z0-9]+$/.test(v);
  },
  message: (props: any) => `${props.value} is not valid! Only alphanumeric characters are allowed.`
};

// Validator for name fields (only letters, no numbers or special characters)
const nameValidator = {
  validator: function(v: string) {
    return /^[a-zA-Z]+$/.test(v);
  },
  message: (props: any) => `${props.value} is not valid! Only letters are allowed.`
};

// Validator for vehicle license plate number (letters, numbers, and spaces allowed, no special characters)
const licensePlateValidator = {
  validator: async function(v: string) {
    const existingUser = await mongoose.models.User.findOne({ vehicleLicensePlateNumber: v });
    return !existingUser; // Return true if no existing user found with the same license plate number
  },
  message: (props: any) => `${props.value} is already registered! Please choose a different license plate number.`
};

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true, validate: nameValidator },
  lastName: { type: String, required: true, validate: nameValidator },
  documentNumber: { type: String, required: true, validate: alphanumericValidator },
  city: { type: String, required: true, validate: alphanumericValidator },
  vehicleType: { type: String, validate: alphanumericValidator },
  vehicleLicensePlateNumber: {
    type: String,
    required: true,
    validate: [
      alphanumericValidator,
      licensePlateValidator
    ]
  },
  fuelCode: { type: String, required: true, validate: alphanumericValidator },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;
