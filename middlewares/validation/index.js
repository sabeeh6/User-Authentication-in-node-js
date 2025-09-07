import { signInValidationSchema, signUpValidationSchema } from "./validation.js"

export const SignUpValidationRequest = (req,res,next)=>{
    const {error} = signUpValidationSchema.validate(req.body , {abortEarly:false})

    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            errors: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            })),
        });
    }

   next()
}

export const signInValidationRequest = (req , res , next) =>{
    const {error} = signInValidationSchema.validate(req.body , {abortEarly: false})

    if (error) {
        return res.status(400).json({
            message:"Validation error",
            Error:error.details.map(detail =>({
                field: detail.path.join('.'),
                messag:detail.message
            }))
        })
    }
    next()
}
