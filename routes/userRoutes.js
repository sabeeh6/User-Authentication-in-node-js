import express from "express";
// import { createUser, delUser, getUser, updateUser } from "../modules/userController.js";
import { signUp, userLogin } from "../modules/auth/authController.js";
import { SignInValidationRequest } from "../middlewares/validation/index.js";


export const router = express.Router();

// router.post("/create" , createUser);
// router.get("/getAll" , getUser);
// router.put('/update/:id', updateUser); 
// router.delete("/delete" , delUser);


router.post("/signUp" ,[SignInValidationRequest] ,signUp);
router.post("/signIn" , userLogin );

