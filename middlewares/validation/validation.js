import Joi from "joi";

export const signUpValidationSchema = Joi.object({
    name: Joi.string()
        .required()
        .label("Name")
        .messages({
            "any.required": "Name is required"
        }),

    email: Joi.string()
        .email()
        .required()
        .label("Email")
        .messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required"
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .label("Password")
        .messages({
            "string.min": "Password must contain at least 8 characters",
            "string.pattern.base": "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
            "any.required": "Password is required"
        }),

    age: Joi.number()
        .required()
        .label("Age")
        .messages({
            "any.required": "Age is required"
        })
});

export const signInValidationSchema = Joi.object({
    email: Joi.string()
    .required()
    .email()
    .label("Email")
    .messages({
        "string.email":"Enter the valid email id ",
        "any.required":"Email is required"
    }),
    password:Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .label("Password")
    .messages({
        "string.min": "Password must contain ata least 8 characters",
        "string.pattern.base" : "Password must contain at least one upercase , one lowercase , one number and one special character",
        "any.required":"Password is required"
    })

})

export const forgotPasswordValidationSchema = Joi.object({

})

// export const auth = async (req, res, next) => {
//     try {
//         const token = req.headers['authorization'];
//         if (!token) {
//             return res.status(401).json({
//                 message: 'You are not authorized to access this protected resource',
//                 statusCode: 401,
//             });
//         }
//         const protectedToken = token.slice('Bearer '.length);
//         const decoded = jwt.verify(protectedToken, config.jwt.secret);
        
//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({
//             message: 'Token Is Invalid!',
//             statusCode: 400,
//         });
//     }
// };
