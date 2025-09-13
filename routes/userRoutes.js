import express from "express";
// import { createUser, delUser, getUser, updateUser } from "../modules/userController.js";
import { forgotPassword1, resetPassword1, signUp, userLogin, verifyOtp } from "../modules/auth/authController.js";
import { forgotPasswordValidationRequest, signInValidationRequest, SignUpValidationRequest } from "../middlewares/validation/index.js";
// import { forgotPassword1, resetPassword1, verifyOtp } from "../modules/user/userController.js";


export const router = express.Router();

// router.post("/create" , createUser);
// router.get("/getAll" , getUser);
// router.put('/update/:id', updateUser); 
// router.delete("/delete" , delUser);


router.post("/signUp" ,[SignUpValidationRequest] ,signUp);
router.post("/signIn" ,[signInValidationRequest] , userLogin );

router.post("/forgot-password", forgotPassword1);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password" ,[forgotPasswordValidationRequest], resetPassword1);

// router.post("/forgot-Password", forgotPassword1);
// router.put("/reset-Password" , [forgotPasswordValidationRequest] , resetPassword1)

