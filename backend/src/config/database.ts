import mongoose from "mongoose";

export async function connectDB(retries = 5) {
  const options = {
    dbName: "rideshare",
    authSource: "admin",
    directConnection: true,
  };

  try {
    await mongoose.connect(process.env.MONGODB_URI!, options);
    console.log("Connected to MongoDB");
  } catch (error) {
    if (retries === 0) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
    console.log(`Retrying connection... (${retries} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectDB(retries - 1);
  }
}
