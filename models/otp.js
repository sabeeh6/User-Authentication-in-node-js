import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
   email: {
     type: String
     },  
   userId: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true
     },

   otp: {
     type: String
     }, 

   otpExpires: { 
    type: Date
     }
});

export default mongoose.model("Otp", otpSchema);
