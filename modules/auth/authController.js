import { userAdmin } from "../../models/user.js";
import bcrypt from "bcrypt";
import { createToken } from "./authService.js";
import Otp from '../../models/otp.js';
import { sendEmail } from "../../middlewares/utility/sendEmail.js";

export const signUp = async(req,res)=>{
    try {
        const { email , password } = req.body;
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
        if (!userExist) {
            return res.status(409).json({message:"Invalid credentials"});
        }

        const validatePassword = await bcrypt.compare(password , userExist.password);
        console.log(password , validatePassword);
        
        if (!validatePassword) {
            return res.status(409).json({message:"Invalid credentials"});
        }
        
        // const userId = userExist._id
        // console.log(userId);
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

export const forgotPassword1 = async(req , res) => {
    try {
        const {email} = req.body;
        const user = await userAdmin.findOne({email})
        if (!user) {
            return res.status(400).json({message:"User not found"});
        }
            await Otp.deleteMany({ userId: user._id });

        const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashGenerateOtp = await bcrypt.hash(generateOtp , 10);
        console.log(generateOtp);

        const expiryDate = Date.now() + 60 * 60 * 1000

        await Otp.create({
            userId:user._id,
            email:user.email,
            otp:hashGenerateOtp,
            otpExpires:expiryDate
        })
        
            await sendEmail(email , "Password reset otp" , `<p>Your otp is <b>${generateOtp}</b></p>`)

        return res.status(200).json({
            message:"Otp send successfully"
        })
        
    } catch (error) {
        console.error("Error" , error);
        res.status(500).json({message:"Internal server eror"})
        
    }
}

export const verifyOtp = async (req , res) =>{
    try {
        const {otp , email} = req.body
        // const email = req.session.email
        const otpUser = await Otp.findOne({email});
        
        if (!otpUser) {
            return res.status(400).json({message:"Not found or expired"})
        }
        console.log(otpUser.otp)
        console.log(otp)
        const isMatch = await bcrypt.compare(otp , otpUser.otp)
        console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({message:"Wrong otp"})
        }
    
        return res.status(200).json({
            message:"Otp verified 🎀"
        })        
    } catch (error) {
        console.error("Error" , error);
        return res.status(500).json({message:"Internal server error"})
    }
}

export const resetPassword1 = async (req, res) => {
  try {
    const { password , email  } = req.body;
    // const {email} = req.query
    if (!email) {
      return res.status(400).json({ message: "Session expired or email not found" });
    }

    const user = await userAdmin.findOne({email});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userAdmin.findOneAndUpdate(
        {email} ,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Password update failed" });
    }

    return res.status(200).json({
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




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
// export const resetPassword = async (req, res) => {
//   try {
//     const {  otp, newPassword } = req.body;

//     // // Find user
//     // const user = await userAdmin.findOne({ email });
//     // if (!user) return res.status(404).json({ message: "User not found" });
//     const user = await otpModel.findOne({
//       otpExpires: { $gt: Date.now() } 
//     });

//     // Find OTP record
//     const otpRecord = await otpModel.findOne({ userId: user._id });
//     if (!otpRecord) return res.status(400).json({ message: "OTP not found or expired" });

//     if (otpRecord.otpExpires < Date.now()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     const isMatch = await bcrypt.compare(otp, otpRecord.otp);
//     if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

//     // Update user password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     // Delete OTP
//     await otpModel.deleteOne({ _id: otpRecord._id });

//     res.json({ message: "Password reset successfully" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
