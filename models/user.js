import mongoose from "mongoose";

const MyUser = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

export const userAdmin = mongoose.model("user" , MyUser)
