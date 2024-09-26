import Joi from "joi";
import { objectId } from "../../Shared/utils/mongoId.validator"; 

export const validateCreateSection = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
  });

  return schema.validate(data);
};

// Validator for updating a section
export const validateUpdateSection = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
  });

  return schema.validate(data);
};

// Validator for checking ObjectId when querying by ID
export const validateSectionId = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().custom(objectId).required(),
  });

  return schema.validate(data);
};
