import { Request, Response, NextFunction } from "express";
import { CartServices } from "./cart.services";
import {
  validateAddToCart,
  validateCreateCart,
  validateRemoveProductFromCart,
} from "./cart.validator";

export class CartController {
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateCreateCart(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const result = await CartServices.createCart(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async addProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { error } = validateAddToCart(req.body);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const result = await CartServices.addProductToCart(req.body);
      return res.status(200).json({ message: result });
    } catch (error) {
      next(error);
    }
  }

  public static async removeProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { productId } = req.params;

      const customerId = "" // grab customerId when you decouple token

      const { error } = validateRemoveProductFromCart({
        customerId,
        productId,
      });

      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const result = await CartServices.removeProductFromCart(
        customerId,
        productId
      );
      return res.status(200).json({ message: result });
    } catch (error) {
      next(error);
    }
  }

  public static async clear(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerId } = req.params;
      const result = await CartServices.clearCart(customerId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerId } = req.params;
      const result = await CartServices.getCartByCustomerId(customerId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
