import orderModel from "./order.model";
import { BaseRepository } from "../../Repository";


class OrderRepository extends BaseRepository<any> {
  constructor() {
    super(orderModel);
  }
}

export default new OrderRepository();
