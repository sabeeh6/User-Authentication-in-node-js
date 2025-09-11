// import { userAdmin } from "../models/user.js"
// export const createUser = async (req,res)=>{
//     try {
//         const {name , email , age , createdAt} = req.body
//         if (!name ||!email ||!age) {
//             return res.status(400).json({message:"All Fields are required"})
//         }


//         const exitingEmail = await userAdmin.findOne({email})
//         if (exitingEmail) {
//             return res.status(409).json({message:"Email Already Exist"})
//         }

//         const user = new userAdmin({name , email, age , createdAt})
//         const savedUser = await user.save();

//         return res.status(200).json({
//             message:"User Created Successfully ✨",
//             data : savedUser
//         })
        
//     } catch (error) {
//     console.error("User creation failed:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// }

// export const getUser = async(req,res)=>{
//     try {
//         const getUser = await userAdmin.find();

//         return res.status(200).json({
//             message:"Fetch All Users",
//             totalUsers:getUser.length,
//             Data:getUser
//         })
        
//     } catch (error) {
//     console.error("User fetching failed:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// }

// export const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const userExist = await userAdmin.findById(id);
//         if (!userExist || Object.keys(userExist).length === 0) {
//             return res.status(409).json({ message: "User not Exist" });
//         }
        
//         const { name, email, age } = req.body;
//         const body = { name, email, age };
//         const updateData = await userAdmin.findByIdAndUpdate(id, body, { new: true });

//         return res.status(200).json({
//             message: "User Updated successfully",
//             Data: updateData,
//         });
//     } catch (error) {
//         console.error("User update failed", error);
//         return res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

// export const delUser = async (req,res) =>{
//     try {
//         const {id}= req.params
//         const exitingUser = await userAdmin.findOne({id});
//         if (!exitingUser) {
//             return res.status(409).json({message:"User not Exist"})
//         }

//         await userAdmin.findByIdAndDelete(exitingUser);
//         return res.status(200).json({
//             message:"User deleted Successfully "

//         })
//     } catch (error) {
//         console.error("User deletion failed");
//         return res.status(500).json({message:"Server error" , error: error.message})
//     }
// }


import { sendEmail } from "../middlewares/utility/sendEmail.js";
import Otp from "../models/otp.js";
import { userAdmin } from "../models/user.js"
import bcrypt from 'bcrypt'

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

        req.session.email = {email};   
        const hey = req.session.email;
        console.log("hey", hey);

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
        const {otp} = req.body
        const email = req.session.email
        const otpUser = await Otp.findOne(email);

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
