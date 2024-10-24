import { Request, Response } from "express";
import { OrderServices } from "./order.services";
import { getAllProductsValidator, orderValidator } from "./order.validator";

export class OrderController {
  public static async placeOrder(req: Request, res: Response) {
    try {
      const { accountType, accountTypeId } = req.user;

      const { error } = orderValidator({ ...req.body });

      if (error)
        return res.status(400).json({ message: error.details[0].message });

      const data = {
        ...req.body,
        accountType,
        accountTypeId,
      };

      const order = await OrderServices.placeOrder(data);

      return res
        .status(200)
        .json({ message: "ORDER CREATED SUCCESSFULLY", order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getOrderByUser(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { accountTypeId: customerId } = req.user;

      const order = await OrderServices.getOrder({ customerId, _id: orderId });
      return res
        .status(200)
        .json({ message: "ORDER FETCHED SUCCESSFULLY", order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  public static async getAllOrdersByUser(req: Request, res: Response) {
    try {
      const query = req.query;

      const { accountTypeId: customerId } = req.user;

      const { error } = getAllProductsValidator(query);

      if (error)
        return res.status(400).json({ message: error.details[0].message });
      
      const orders = await OrderServices.getAllUserOrders(customerId, query);

      return res
        .status(200)
        .json({ message: "ORDERS FETCHED SUCCESSFULLY", orders });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
