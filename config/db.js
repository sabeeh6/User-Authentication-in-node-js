 import mongoose from "mongoose";

export const connectDb = ()=>{ mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("Database Connected 😎")
  }).catch((error)=>{console.log("ERROR" ,error);
  })}
