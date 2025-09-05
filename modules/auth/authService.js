import jwt from "jsonwebtoken";

export const createToken = (userId)=>{
if (!process.env.JWT_PRIVATE_KEY) {
        throw new error("Private Key is missing")
    }    
    try {
        return jwt.sign({id : userId} ,process.env.JWT_PRIVATE_KEY , {expiresIn : "1d"} )
    } catch (error) {
        console.error("Error while creating loginToken" , error.message);
        return null
    }
}
