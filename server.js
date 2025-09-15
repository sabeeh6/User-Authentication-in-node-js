import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import  {router}  from "./routes/userRoutes.js";
import { connectDb } from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
app.use(express.urlencoded({extended:false}));
// Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

connectDb()
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on Port`);
  })
  
    app.use("/api", router);
  // mongoose.connect(MongoDb).then(()=>{
  //   console.log("Database Connected 😎")
  //   app.use("/api", router);
  // })
