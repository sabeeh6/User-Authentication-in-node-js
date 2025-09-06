import { signInValidationSchema } from "./validation.js"

export const SignInValidationRequest = (req,res,next)=>{
    const {error} = signInValidationSchema.validate(req.body , {abortEarly:false})

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