import Joi from "joi";
import { objectId } from "../../Shared/utils/mongoId.validator";
import { BadRequestException } from "../../Shared/Exceptions";

export class ProductValidator {
  public static createProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    benefits: Joi.string().optional(),
    size: Joi.string().optional(),
    originalPrice: Joi.number().required(),
    discountPrice: Joi.number().optional(),
    percentageDiscount: Joi.number().optional(),
    stockQty: Joi.number().min(1).required(),
    stockQtyAlert: Joi.number().min(1).optional(),
    isFeatured: Joi.boolean().optional(),
    image: Joi.string().required(),
    views: Joi.number().optional(),
    likes: Joi.number().optional(),
    category: Joi.string().custom(objectId).required(),
    subCategory: Joi.string().custom(objectId).optional(),
    productSection: Joi.string()
      .valid("mealkits", "marketplace", "farmbox")
      .required(),

    // fields for mealkits
    duration: Joi.string().when("productSection", {
      is: "mealkits",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    servings: Joi.number().when("productSection", {
      is: "mealkits",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    calories: Joi.string().when("productSection", {
      is: "mealkits",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    ingredients: Joi.object({
      cover: Joi.string().required(),
      main: Joi.array()
        .items(
          Joi.object({
            quantity: Joi.string().required(),
            item: Joi.string().required(),
          })
        )
        .required(),
      others: Joi.array()
        .items(
          Joi.object({
            quantity: Joi.string().optional(),
            item: Joi.string().optional(),
          })
        )
        .optional(),
    }).when("productSection", {
      is: "mealkits",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    instructions: Joi.object({
      cover: Joi.string().required(),
      data: Joi.string().required(),
    }).when("productSection", {
      is: "mealkits",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    tags: Joi.array().items(Joi.string()).when("productSection", {
      is: "mealkits",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  });

  public static updateProductSchema = Joi.object({
    productId: Joi.string().custom(objectId).required(),
    payload: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      benefits: Joi.string().optional(),
      size: Joi.string().optional(),
      originalPrice: Joi.number().optional(),
      discountPrice: Joi.number().optional(),
      percentageDiscount: Joi.number().optional(),
      stockQty: Joi.number().min(0).optional(),
      stockQtyAlert: Joi.number().min(0).optional(),
      isFeatured: Joi.boolean().optional(),
      image: Joi.string().optional(),
      productSection: Joi.string().optional(),
      category: Joi.string().custom(objectId).optional(),
      subCategory: Joi.string().custom(objectId).optional(),
    }),
  });

  public static getAllProductsSchema = Joi.object({
    sort: Joi.number().valid(1, -1).optional(),
    pageSize: Joi.number().min(1).default(10),
    pageNumber: Joi.number().min(1).default(1),
  });
}

export const validateGetAllProducts = (data) => {
  const schema = Joi.object({
    category: Joi.string().custom(objectId).optional(),
    subCategory: Joi.string().custom(objectId).optional(),
    productSection: Joi.string()
      .valid("mealkits", "marketplace", "farmbox")
      .optional(),
    sort: Joi.number().valid(1, -1),
    pageSize: Joi.number().min(1).default(10),
    pageNumber: Joi.number().min(1).default(1),
  }).or("subCategory", "productSection", "category");

  return schema.validate(data);
};

export const validateRequest = (data: any, schema: Joi.Schema) => {
  const { error } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error) {
    throw new BadRequestException(
      error.details.map((x) => x.message).join(", ")
    );
  }
};
