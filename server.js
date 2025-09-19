import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import  {router}  from "./routes/authRoutes.js";
import { connectDb } from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
app.use(express.urlencoded({extended:false}));

app.listen(process.env.PORT,()=>{
  console.log(`Server is running on Port`);
})
connectDb()

    app.use("/api", router);

