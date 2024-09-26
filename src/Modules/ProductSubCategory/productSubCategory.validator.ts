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
    category: Joi.string().custom(objectId).required(),
    productSection: Joi.string().custom(objectId).required(),
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
  data: GetAllProductSubCategoriesInput
) => {
  const schema = Joi.object({
    sort: Joi.string().valid("asc", "desc").default("desc"),
    pageSize: Joi.number().min(1).default(10),
    pageNumber: Joi.number().min(1).default(1),
  });

  return schema.validate(data);
};
