import mongoose, { Schema, Document } from "mongoose";

export enum DeliveryMode {
  To_Door = "To_Door", // Delivery to the customer's door
  Pick_Up = "Pick_Up", // Customer will pick up the order
}

export enum PaymentMethod {
  Card = "Card", // Payment via card
  Wallet = "Wallet", // Payment via digital wallet
  BankTransfer = "Bank_Transfer", // Payment via bank transfer
  CashOnDelivery = "Cash_On_Delivery", // Payment upon delivery
}

export enum DeliveryStatus {
  Processing = "Processing", // Order is currently being prepared for shipment (Inventory management, packaging, and labeling)
  Shipped = "Shipped", // Order has been handed over to the shipping carrier and is in transit to the customer's delivery address
  Delivered = "Delivered", // Order has been successfully delivered
  DeliveryFailed = "DeliveryFailed", // Delivery attempt was unsuccessful for various reasons (consolidated status for AttemptedDelivery and FailedDelivery)
  Cancelled = "Cancelled", // Order has been cancelled
  Refunded = "Refunded", // Order has been refunded
}

export enum PaymentStatus {
  Paid = "Paid",
  Not_Paid = "Not_Paid",
}

/**
 * Interface for the Order model.
 */
export interface IOrderModel extends Document {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  shippingAddress: {
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    postalCode: number;
  };
  delivery: {
    date: Date;
    mode: DeliveryMode;
    status: DeliveryStatus;
  };
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId: string;
  };
  orderItems: {
    product: string;
    quantity: number;
    price: number;
    accountType: "Vendor";
    accountTypeId: Schema.Types.ObjectId;
  }[];
  totalPrice: number;
  taxAmountInPercent: number;
  customerId: Schema.Types.ObjectId;
}

const orderSchema = new Schema<IOrderModel>(
  {
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
    },
    shippingAddress: {
      address1: String,
      address2: String,
      country: String,
      state: String,
      city: String,
      postalCode: Number,
    },
    delivery: {
      date: Date,
      mode: {
        type: String,
        default: DeliveryMode.To_Door,
        validate: {
          validator: (value: string) =>
            Object.values(DeliveryMode).includes(value as DeliveryMode),
          message: `Only allowed values: ${Object.values(DeliveryMode).join(
            ", "
          )}`,
        },
      },
      status: {
        type: String,
        default: DeliveryStatus.Processing,
        validate: {
          validator: (value: string) =>
            Object.values(DeliveryStatus).includes(value as DeliveryStatus),
          message: `Only allowed values: ${Object.values(DeliveryStatus).join(
            ", "
          )}`,
        },
      },
    },
    payment: {
      method: {
        type: String,
        default: PaymentMethod.Card,
        validate: {
          validator: (value: string) =>
            Object.values(PaymentMethod).includes(value as PaymentMethod),
          message: `Only allowed values: ${Object.values(PaymentMethod).join(
            ", "
          )}`,
        },
      },
      status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.Not_Paid,
      },
      transactionId: String,
    },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        accountType: {
          type: String,
          enum: ["Vendor"],
          index: true,
        },
        accountTypeId: {
          type: Schema.Types.ObjectId,
          refPath: "accountType",
          index: true,
        },
        _id: false
      },
    ],
    totalPrice: Number,
    taxAmountInPercent: { type: Number, default: 7.5 },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IOrderModel>("Order", orderSchema);
