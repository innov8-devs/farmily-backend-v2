import { Request, Response } from "express";
import { ProductServices } from "./product.services";
import {
  ProductValidator,
  validateRequest,
  validateGetAllProducts,
} from "./product.validator";
export class ProductController {
  public static async createProduct(req: Request, res: Response) {
    try {
      validateRequest(req.body, ProductValidator.createProductSchema);

      const createdProduct = await ProductServices.createProduct(req.body);
      
      res.status(201).json({
        message: "Product created successfully",
        data: createdProduct,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  public static async updateProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const payload = { ...req.body };
      const data = {
        productId,
        payload,
      };

      validateRequest(data, ProductValidator.updateProductSchema);

      const updatedProduct = await ProductServices.updateProduct(data);

      res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  public static async getAllProducts(req: Request, res: Response) {
    try {
      const query = req.query;
      const { error } = validateGetAllProducts(req.query);

      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const products = await ProductServices.getAllProducts(query);
      res
        .status(200)
        .json({ message: "Products retrieved successfully", data: products });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  public static async deleteProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      await ProductServices.deleteProduct(productId);
      
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  public static async getProductSuggestions(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      const products = await ProductServices.getProductSuggestions(
        q as string
      );

      return res.status(200).json({ message: "Success", data: products });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  }
}
