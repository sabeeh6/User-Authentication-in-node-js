import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import  {router}  from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
app.use(express.urlencoded({extended:false}));

const PORT = process.env.PORT;
const MongoDb = process.env.DB_URL

mongoose.connect(MongoDb).then(()=>{
    console.log("Database Connected 😎")
    app.listen(PORT,()=>{
        console.log(`Server is running on Port`);
    })
}).catch((error)=>{console.log("ERROR" ,error);
});
app.use("/api", router);
