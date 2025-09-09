import { userAdmin } from "../../models/user.js";
import bcrypt from "bcrypt";
import { createToken } from "./authService.js";
import crypto from "crypto";
import User from '../../models/otp.js';
import { sendEmail } from "../../middlewares/utility/sendEmail.js";
// import { sendEmail } from "../utils/sendEmail.js";

export const signUp = async(req,res)=>{
    try {
        const {name , email , password } = req.body;
        const userExist = await userAdmin.findOne({email});
        if (userExist) {
            return  res.status(409).json({message:"User already exist"})
        }

        const hash = await bcrypt.hash(password , 10);
        const newUser = {...req.body , password: hash}
        await userAdmin.create(newUser);
        console.log("why?");
        
        return res.status(200).json({
            message:"User Sign Up Successfully (❁´◡`❁)",
            Data:newUser
        })        
    } catch (error) {
        console.error("Registration Failed");
        return res.status(500).json({message:"Internal Server Error" , error: error.message})
    }
}

export const userLogin = async(req,res)=>{
    try {
        const { email , password} = req.body

        const userExist = await userAdmin.findOne({email})
        // !userExist?res.status(401).json({message:"Incorrect email"}):null;
        if (!userExist) {
            return res.status(409).json({message:"Incorect email"});
        }

        const validatePassword = await bcrypt.compare(password , userExist.password);
        console.log(password , validatePassword);
        
        // !validatePassword? res.status(419).json({message:"Incorrect Password "}):null;
        if (!validatePassword) {
            return res.status(409).json({message:"Incorrect Password"});
        }
        
        const userId = userExist._id
        console.log(userId);
        const loginToken = createToken(userId);
        console.log("Login Token",loginToken);
        

        return res.status(200).json({
            message:"Login Successfully",
            Data:userExist,
            Token:loginToken
        });
    } catch (error) {
        console.error("Login Failed");
        return res.status(500).json({message:"Internal Server Error" ,error:error.message})
    }
}

// Step 1: Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 50 mins
    await user.save();

    // Send email
    await sendEmail(email, "Password Reset OTP", `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Step 2: Verify OTP & Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(user.otp);
    console.log(user.otpExpires);

    
    if (!user.otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired or not set" });
    }

    console.log("User" , user.otp);
    console.log("OTP" , otp);
    console.log("OTP" , newPassword);

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });
console.log("Match");

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
console.log("Hashed");

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error , error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
