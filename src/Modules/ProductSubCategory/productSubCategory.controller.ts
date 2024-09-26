import { Request, Response, NextFunction } from "express";
import { ProductSubCategoryServices } from "./productSubCategory.services";
import {
  validateCreateProductSubCategory,
  validateUpdateProductSubCategory,
  validateGetAllProductSubCategories,
} from "./productSubCategory.validator";

export class ProductSubCategoryController {
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateCreateProductSubCategory(req.body);

      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const result = await ProductSubCategoryServices.createProductSubCategory(
        req.body
      );
      
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateUpdateProductSubCategory(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const result = await ProductSubCategoryServices.updateProductSubCategory(
        req.body
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { productSubCategoryId } = req.params;
      const result = await ProductSubCategoryServices.deleteProductSubCategory(
        productSubCategoryId
      );
      return res.status(200).json({ message: result });
    } catch (error) {
      next(error);
    }
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateGetAllProductSubCategories(req.query);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const result =
        await ProductSubCategoryServices.getAllProductSubCategories(req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { productSubCategoryId } = req.params;
      const result = await ProductSubCategoryServices.getProductSubCategory({
        _id: productSubCategoryId,
      });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
