import connectToDatabase from '@/lib/db';
import User, { UserDocument } from '@/lib/modal/users';
import { NextResponse } from 'next/server';

// Function to generate fuel code
const generateFuelCode = async () => {
  // Implement your logic here to generate the fuel code
  // This logic should ensure the code is unique and follows the specified format
  // For example, you can generate it based on sequential numbering or any other method as per your requirements
  const latestUser = await User.findOne().sort({ createdAt: -1 });
  const lastFuelCode = latestUser ? latestUser.fuelCode : 'KDOCY000000';
  const lastNumber = parseInt(lastFuelCode.slice(-6)) + 1;
  const newFuelCode = `KDOCY${('000000' + lastNumber).slice(-6)}`;
  return newFuelCode;
};

// GET all users
export const GET = async () => {
  try {
    await connectToDatabase();
    const users = await User.find().select('+email +password +fullname +phone +identificationNumber +vehicleType +vehicleLicensePlateNumber +fuelCode +createdAt +updatedAt');
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(`Error fetching users: ${error}`, { status: 500 });
  }
};

// POST create a new user
export const POST = async (request: Request) => {
  try {
    await connectToDatabase();
    const { email, password, fullname, phone, identificationNumber, vehicleType, vehicleLicensePlateNumber } = await request.json();
    
    // Generate fuel code
    const fuelCode = await generateFuelCode();

    const newUser = new User({ email, password, fullname, phone, identificationNumber, vehicleType, vehicleLicensePlateNumber, fuelCode });
    const savedUser = await newUser.save();
    return new NextResponse(JSON.stringify(savedUser), { status: 201 });
  } catch (error) {
    return new NextResponse(`Error creating user: ${error}`, { status: 500 });
  }
};

// PUT update a user
export const PUT = async (request: Request) => {
  try {
    await connectToDatabase();
    const { _id, email, password, fullname, phone, identificationNumber, vehicleType, vehicleLicensePlateNumber } = await request.json();

    // Generate fuel code if updating vehicle information
    let fuelCode = undefined;
    if (vehicleType || vehicleLicensePlateNumber) {
      fuelCode = await generateFuelCode();
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { email, password, fullname, phone, identificationNumber, vehicleType, vehicleLicensePlateNumber, fuelCode, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedUser) {
      return new NextResponse(`User not found with id ${_id}`, { status: 404 });
    }
    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new NextResponse(`Error updating user: ${error}`, { status: 500 });
  }
};

// DELETE a user
export const DELETE = async (request) => {
  try {
    await connectToDatabase();
    const id = request.query?.id;
    if (!id) {
      return new NextResponse(`User ID is required`, { status: 400 });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return new NextResponse(`User not found with id ${id}`, { status: 404 });
    }
    return new NextResponse(`User deleted successfully`, { status: 200 });
  } catch (error) {
    return new NextResponse(`Error deleting user: ${error}`, { status: 500 });
  }
};
