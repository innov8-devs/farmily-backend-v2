import Joi from 'joi';

const accountSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().required(),
  passwordChangedAt: Joi.date().optional(),
  verificationToken: Joi.string().optional(),
  isVerified: Joi.boolean().default(false),
  isVerifiedAt: Joi.date().optional(),
  resetToken: Joi.string().optional(),
  resetAt: Joi.date().optional(),
  accountType: Joi.string().valid('Customer', 'Vendor').required(),
  accountTypeId: Joi.string().optional(),
  provider: Joi.string().valid('Local', 'Google').default('Local'),
});

export const validateCreateAccount = (data: any) => {
  return accountSchema.validate(data, { abortEarly: false });
};

export const validateUpdateAccount = (data: any) => {
  return accountSchema
    .fork(['email', 'password'], schema => schema.optional())
    .validate(data, { abortEarly: false });
};