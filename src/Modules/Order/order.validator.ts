import Joi from "joi";
import { objectId } from "../../Shared/utils/mongoId.validator";

export const orderValidator = (data) => {
  const schema = Joi.object({
    customer: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string()
        .pattern(/^\+?\d{10,15}$/)
        .required(), // validates phone numbers with optional '+' and 10-15 digits
    }).required(),

    shippingAddress: Joi.object({
      address1: Joi.string().required(),
      address2: Joi.string().allow(null, ""),
      country: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.number().integer().required(),
    }).required(),

    delivery: Joi.object({
      deliverAt: Joi.date().iso().optional(),
      mode: Joi.string().valid("To_Door", "Pick_Up").required(),
    }).required(),

    cartId: Joi.string().custom(objectId).required(),
  });

  return schema.validate(data);
};
