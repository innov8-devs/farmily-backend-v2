import mongoose, { Schema, Document } from "mongoose";
import { IImage } from "../Images/imageTypes";
// import { IKeyword } from "../../Keywords/Types";
// import { IProductCategory } from "../../ProductCategory/Types";
// import { IDiscount } from "../../Discount/Types";
// import { IProductBrand } from "../../ProductBrand/Types";
// import { IProductSubCategory } from "../../ProductSubCategory/Types";

export interface IProductModel extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  benefits: string;
  information: string;
  shippingCharges: string;
  size: string;
  price: number;
  quantity: number;
  quantityAlert: number;
  image: IImage;
  //   keywords: IKeyword[];
  //   category: IProductCategory;
  //   subCategory: IProductSubCategory;
  //   discounts: IDiscount[];
  //   brand: IProductBrand;
  views: number;
  productSection: "Marketplace" | "Mealkit" | "Farmbox";
  productSectionId: Schema.Types.ObjectId;
}

const productSchema = new Schema<IProductModel>(
  {
    name: { type: String, index: true },
    slug: { type: String, index: true },
    description: String,
    benefits: String,
    information: String,
    shippingCharges: String,
    size: { type: String, index: true },
    price: { type: Number, index: true },
    quantity: Number,
    quantityAlert: Number,
    image: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      index: true,
    },
    /*
    keywords: [
      {
        type: Schema.Types.ObjectId,
        ref: "Keyword",
        index: true,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      index: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      index: true,
    },
    discounts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Discount",
        index: true,
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: "ProductBrand",
      index: true,
    },
    */
    views: {
      type: Number,
      default: 0,
    },
    productSection: {
      type: String,
      enum: ["Farmbox", "MealKit", "Marketplace"],
      index: true,
    },
    productSectionId: {
      type: Schema.Types.ObjectId,
      refPath: "productSection",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IProductModel>("Product", productSchema);
