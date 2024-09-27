import { Request, Response, NextFunction } from "express";
import ProductCategoryServices from "./productCategory.services";
import {
  validateCreateProductCategory,
  validateGetAllCategoriesBySection,
  updateCategoryValidator
} from "./productCategory.validator";

class ProductCategoryController {
  public static async createCategory(req: Request, res: Response) {
    try {
      const { error } = validateCreateProductCategory(req.body);
      if (error) return res.status(400).json({ message: error.message });

      const newCategory = await ProductCategoryServices.createProductCategory(
        req.body
      );
      return res.status(201).json(newCategory);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  public static async getAllCategoriesBySection(req: Request, res: Response) {
    try {
      // const sectionId = req.query.sectionId;

      const { error } = validateGetAllCategoriesBySection({
        // sectionId,
        ...req.query,
      });

      if (error) return res.status(400).json({ message: error.message });

      const categories =
        await ProductCategoryServices.getAllCategoriesBySection(
          // sectionId,
          req.query
        );
        
      return res.status(200).json(categories);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error.message });
    }
  }

  public static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = updateCategoryValidator.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });

      const updatedCategory = await ProductCategoryServices.updateCategory(req.params.id, req.body);
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductCategoryServices.deleteCategory(req.params.id);
      return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await ProductCategoryServices.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.status(200).json({ data: category });
    } catch (error) {
      next(error);
    }
  }
}

export default ProductCategoryController;
