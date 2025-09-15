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
