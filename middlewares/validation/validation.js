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
