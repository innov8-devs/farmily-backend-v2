import mongoose from "mongoose";
import Joi from "joi";

export const objectId = (value: string, helpers: Joi.CustomHelpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message({ custom: `"${value}" is not a valid ObjectId` });
  }
  return value;
};
