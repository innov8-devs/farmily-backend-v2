import Joi from "joi";
import { objectId } from "../../Shared/utils/mongoId.validator"; 

export const validateCreateProductCategory = (data: any) => {
  const schema = Joi.object({
    label: Joi.string().required(),
    description: Joi.string().optional(),
    image: Joi.string().custom(objectId).required(),
    cover: Joi.string().optional(),
    productSection: Joi.string().required(),
    productSectionId: Joi.string().custom(objectId).required(),
  });

  return schema.validate(data);
};

export const validateGetAllCategoriesBySection = (data: any) => {
  const schema = Joi.object({
    section: Joi.string().optional(),
    sectionId: Joi.string().custom(objectId).optional(),
    sort: Joi.string().valid("asc", "desc").default("desc"),
    pageSize: Joi.number().min(1).default(10),
    pageNumber: Joi.number().min(1).default(1),
  });

  return schema.validate(data);
};

export const updateCategoryValidator = Joi.object({
  label: Joi.string().optional(),
  description: Joi.string().optional(),
  image: Joi.string().optional(),
  productSection: Joi.string().optional(),
  productSectionId: Joi.string().optional(),
});

