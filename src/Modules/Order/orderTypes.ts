import { DeliveryMode, PaymentMethod } from "./order.model";

class CustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

class ShippingAddressInput {
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  postalCode: number;
}

class DeliveryInput {
  deliverAt: Date;
  mode: DeliveryMode;
  instruction: string;
}

class PaymentInput {
  method?: PaymentMethod;
}

class OrderItemInput {
  product: string;
  quantity: number;
}

export class PlaceOrderInput {
  customer?: CustomerInput;
  shippingAddress: ShippingAddressInput;
  delivery: DeliveryInput;
  payment: PaymentInput;
  orderItems?: OrderItemInput[];
  cartId: string;
}

export class PlaceOrderDTO extends PlaceOrderInput {
  totalPrice: number;
  accountType: string;
  accountTypeId: string;
}
