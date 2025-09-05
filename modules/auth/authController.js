import { userAdmin } from "../../models/user.js";
import bcrypt from "bcrypt";
import { createToken } from "./authService.js";

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
