// import joi from "joi";

// export const signInValidationSchema = joi.object({
//     name:joi.required().label("Name"),
//     email: joi.string().required().email().label("Email"),
//     password:joi.string()
//     .min(8)
//     .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
//     .messages({
//         "string.patterin.base"  :"Password must contain at least one letter and one number"
//     })  
//     .required() 
//     ,
//     age:joi.required().label("Age")
// })


// CODE FROM GPT 

import Joi from "joi";

export const signInValidationSchema = Joi.object({
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
