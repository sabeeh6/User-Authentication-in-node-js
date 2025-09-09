import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String }, // Hashed OTP
  otpExpires: { type: Date }
});

export default mongoose.model("User", userSchema);
