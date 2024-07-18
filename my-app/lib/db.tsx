import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

// Function to connect to MongoDB
const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB");
      return true; // Already connected, return true
    }

    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    return true; // Return true on successful connection

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Error connecting to database");
  }
};

export default connectToDatabase;
