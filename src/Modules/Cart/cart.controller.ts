import { Request, Response, NextFunction } from "express";
import { CartServices } from "./cart.services";
import {
  validateAddToCart,
  validateRemoveProductFromCart,
  validateIncrementorDecrementQty,
} from "./cart.validator";
import { InternalServerException } from "../../Shared/Exceptions";

export class CartController {
  public static async addProduct(
    req: Request,
    res: Response,
  ) {
    try {
      const { accountTypeId } = req.user;

      const data = { ...req.body, customerId: accountTypeId };

      const { error } = validateAddToCart(data);
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const result = await CartServices.addProductToCart(data);

      return res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async incrementorDecrementProductQty(
    req: Request,
    res: Response,
  ) {
    try {
      const { accountTypeId: customerId } = req.user;

      const data = { ...req.body, customerId, ...req.params};

      const { error } = validateIncrementorDecrementQty(data);

      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const result = await CartServices.incrementOrDecrementProductQty(data);

      return res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({error})
    }
  }

  public static async removeProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { productId } = req.params;

      const { accountTypeId } = req.user;

      const { error } = validateRemoveProductFromCart({
        customerId: accountTypeId,
        productId,
      });

      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const result = await CartServices.removeProductFromCart(
        accountTypeId,
        productId
      );
      return res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({error})
    }
  }

  public static async clear(req: Request, res: Response) {
    try {
      const { accountTypeId } = req.user;

      const result = await CartServices.clearCart(accountTypeId);

      return res.status(200).json(result);
    } catch (error) {
      throw new InternalServerException("CLEAR CART FAILED");
    }
  }

  public static async getCart(req: Request, res: Response) {
    try {
      const { accountTypeId } = req.user;

      const result = await CartServices.getCartByCustomerId(accountTypeId);

      return res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
