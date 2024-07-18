import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URL: string = process.env.MONGODB_URL || '';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions); 

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', );
  
    process.exit(1);
  }
};

export default connectToDatabase;
