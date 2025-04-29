import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://sauravaryan155:0TtE4dTJKVrhU5bt@cluster0.sl7lr02.mongodb.net/");

    console.log("MongoDB connection successful!!");
  } catch (error) {
    console.log("Error in connection", error);
  }
};
