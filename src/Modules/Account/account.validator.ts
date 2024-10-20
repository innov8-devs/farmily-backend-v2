import Joi from "joi";
import { objectId } from "../../Shared/utils/mongoId.validator";

const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string()
    .pattern(/^(?:\+234|0)[0-9]{10}$/, "phone number")
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be in the format +2348123456789 or 08123456789",
      "string.empty": "Phone number is required",
    }),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/[A-Z]/, "uppercase letter")
    .pattern(/[0-9]/, "number")
    .pattern(/[@!#$%^&*(),.?":{}|<>]/, "special character")
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one number, and one special character",
      "string.empty": "Password is required",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateAccountDetailsSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  password: Joi.string().required(),
  accountId: Joi.string().custom(objectId).required(),
}).or("firstName", "lastName", "phoneNumber"); // Require at least one of these fields

export class AccountValidator {
  public static validateSignup = (data: any) => {
    return signupSchema.validate(data, { abortEarly: false });
  };

  public static validateLogin = (data: any) => {
    return loginSchema.validate(data, { abortEarly: false });
  };

  public static validateUpdateAccountDetails = (data: any) => {
    return updateAccountDetailsSchema.validate(data, { abortEarly: false });
  };
}
