import { userAdmin } from "../../models/user.js";
import bcrypt from "bcrypt";
import { createToken } from "./authService.js";
import crypto from "crypto";
// import {userAdmin} from '../../models/user.js';
import otpModel from '../../models/otp.js';
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
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await userAdmin.findOne({ email });
//     console.log(user);
    
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Hash OTP before saving
//     const hashedOtp = await bcrypt.hash(otp, 10);

//     user.otp = hashedOtp;
//     user.otpExpires = Date.now() + 5 * 60 * 1000; // 50 mins
//     await user.save();

//     // Send email
//     await sendEmail(email, "Password Reset OTP", `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`);

//     res.json({ message: "OTP sent to your email" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };



// import OtpModel from "./models/otp.js"; // import your OTP schema
// import { userAdmin } from "./models/user.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user
    const user = await userAdmin.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Generate OTP
    const Otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(Otp, 10);

    // 3. Remove previous OTPs for this user (optional cleanup)
    await otpModel.deleteMany({ userId: user._id });

    // 4. Create new OTP document
    await otpModel.create({
      userId: user._id,
      otp: hashedOtp,
      otpExpires: Date.now() + 5 * 60 * 1000 // 5 mins
    });

    // 5. Send email
    await sendEmail(email, "Password Reset OTP", `<p>Your OTP is <b>${Otp}</b>. It expires in 5 minutes.</p>`);

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const {  otp, newPassword } = req.body;

    // // Find user
    // const user = await userAdmin.findOne({ email });
    // if (!user) return res.status(404).json({ message: "User not found" });
    const user = await otpModel.findOne({
      otpExpires: { $gt: Date.now() } 
    });

    // Find OTP record
    const otpRecord = await otpModel.findOne({ userId: user._id });
    if (!otpRecord) return res.status(400).json({ message: "OTP not found or expired" });

    if (otpRecord.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    // Update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP
    await otpModel.deleteOne({ _id: otpRecord._id });

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};





// Step 2: Verify OTP & Reset Password
// export const resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     // const user = await User.findOne({ email });
//  const user = await User.findOne({
//       otpExpires: { $gt: Date.now() } 
//     });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: "OTP expired or not set" });
//     }
    
//     const isMatch = await bcrypt.compare(otp, user.otp);
//     if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });
// console.log("Match");

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
// console.log("Hashed");

//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     res.json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.error(error , error.message);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
