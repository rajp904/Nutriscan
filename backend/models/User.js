import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length
    },
    age: {
      type: Number,
      required: true,
      min: 10, // Assuming users should be at least 10 years old
      max: 120,
    },
    weight: {
      type: Number,
      required: true,
      min: 20, // Minimum weight in kg
      max: 300, // Maximum weight in kg
    },
    height: {
      type: Number,
      required: true,
      min: 50, // Minimum height in cm
      max: 250, // Maximum height in cm
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"], // Restrict gender options
      required: true,
    },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields automatically
);


// ✨ Hide sensitive data when returning user object
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password; // Remove password field
  return userObject;
};

// Export the model
export default mongoose.model("User", userSchema);