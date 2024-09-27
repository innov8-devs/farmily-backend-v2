import Joi from "joi";
import {
  CreateProductSubCategoryInput,
  UpdateProductSubCategoryInput,
  GetAllProductSubCategoriesInput,
} from "./productSubCategoryTypes";
import { objectId } from "../../Shared/utils/mongoId.validator";

export const validateCreateProductSubCategory = (
  data: CreateProductSubCategoryInput
) => {
  const schema = Joi.object({
    label: Joi.string().required(),
    description: Joi.string().optional(),
    image: Joi.string().required(),
    productSection: Joi.string().required(),
    productSectionId: Joi.string().custom(objectId).required(),
    category: Joi.string().custom(objectId).required(),
  });

  return schema.validate(data);
};

export const validateUpdateProductSubCategory = (
  data: UpdateProductSubCategoryInput
) => {
  const schema = Joi.object({
    _id: Joi.string().custom(objectId).required(),
    payload: Joi.object({
      label: Joi.string().optional(),
      description: Joi.string().optional(),
      image: Joi.string().optional(),
    }).required(),
  });

  return schema.validate(data);
};

export const validateGetAllProductSubCategories = (
  data
) => {
  const schema = Joi.object({
    category: Joi.string().custom(objectId).optional(),
    productSectionId: Joi.string().custom(objectId).optional(),
    sort: Joi.number().valid(1, -1),
    pageSize: Joi.number().min(1).default(10),
    pageNumber: Joi.number().min(1).default(1),
  }).or("category", "productSectionId");

  return schema.validate(data);
};
