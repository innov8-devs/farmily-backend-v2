import Joi from "joi";
import { CreateCartInput, AddToCartDTO } from "./cartTypes";
import { objectId } from "../../Shared/utils/mongoId.validator";

export const validateCreateCart = (data: CreateCartInput) => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          quantity: Joi.number().required().min(1),
        })
      )
      .required(),
  });

  return schema.validate(data);
};

export const validateAddToCart = (data: AddToCartDTO) => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          quantity: Joi.number().required().min(1),
        })
      )
      .required(),
  });

  return schema.validate(data);
};

export const validateIncrementorDecrementQty = (data) => {

  const schema = Joi.object({
    customerId: Joi.string().required(),
    quantity: Joi.number().required(),
    productId: Joi.string().custom(objectId).required(),
  });

  return schema.validate(data);
}

export const validateRemoveProductFromCart = (data: {
  customerId: string;
  productId: string;
}) => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    productId: Joi.string().required(),
  });

  return schema.validate(data);
};
