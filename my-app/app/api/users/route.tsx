// lib/api/users.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User, { UserDocument } from '@/lib/modal/users';

// Function to generate fuel code
const generateFuelCode = async () => {
  try {
    const latestUser = await User.findOne().sort({ createdAt: -1 });
    const lastFuelCode = latestUser ? latestUser.fuelCode : 'KDOCY000000';
    const lastNumber = parseInt(lastFuelCode.slice(-6)) + 1;
    if (lastNumber > 500000) {
      throw new Error('Maximum fuel code limit reached');
    }
    const newFuelCode = `KDOCY${('000000' + lastNumber).slice(-6)}`;
    return newFuelCode;
  } catch (error) {
    throw new Error(`Error generating fuel code: ${error}`);
  }
};

// GET all users
export const GET = async () => {
  try {
    await connectToDatabase();
    const users = await User.find().select('name lastName documentNumber city vehicleType vehicleLicensePlateNumber fuelCode createdAt updatedAt');
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(`Error fetching users: ${error}`, { status: 500 });
  }
};

// POST create a new user
export const POST = async (request: Request) => {
  try {
    await connectToDatabase();
    const { name, lastName, documentNumber, city, vehicleType, vehicleLicensePlateNumber } = await request.json();
    
    // Generate fuel code
    const fuelCode = await generateFuelCode();

    const newUser = new User({ name, lastName, documentNumber, city, vehicleType, vehicleLicensePlateNumber, fuelCode });
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
    const { _id, name, lastName, documentNumber, city, vehicleType, vehicleLicensePlateNumber } = await request.json();

    // Generate fuel code if updating vehicle information
    let fuelCode = undefined;
    if (vehicleType || vehicleLicensePlateNumber) {
      fuelCode = await generateFuelCode();
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, lastName, documentNumber, city, vehicleType, vehicleLicensePlateNumber, fuelCode, updatedAt: Date.now() },
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
export const DELETE = async (request: Request) => {
  try {
    await connectToDatabase();
    const { _id } = await request.json();

    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      return new NextResponse(`User not found with id ${_id}`, { status: 404 });
    }
    return new NextResponse(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
  } catch (error) {
    return new NextResponse(`Error deleting user: ${error}`, { status: 500 });
  }
};
