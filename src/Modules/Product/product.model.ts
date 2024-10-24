import mongoose, { Schema, Document } from "mongoose";
import { IImage } from "../Image/imageTypes";
import { IProductCategoryModel } from "../ProductCategory/productCategory.model";
import { IProductSubCategoryModel } from "../ProductSubCategory/productSubCategory.model";

export interface IProductModel extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  benefits: string;
  size: string;
  originalPrice: number;
  discountPrice: number;
  percentageDiscount: number;
  stockQty: number;
  stockQtyAlert: number;
  isFeatured: Boolean;
  image: IImage;
  cover: IImage[];
  duration: string; // to cook meal(Mealkit)
  servings: number;
  calories: number;
  ingredients: {
    cover: IImage;
    main: [
      {
        weight: string;
        item: string;
      }
    ];
    others: [
      {
        weight: string;
        item: string;
      }
    ];
  };
  instructions: {
    cover: IImage;
    data: string;
  };
  views: number;
  likes: number;
  tags: string[];
  productSection: string;
  category: Schema.Types.ObjectId | IProductCategoryModel;
  subCategory: Schema.Types.ObjectId | IProductSubCategoryModel;
}

const productSchema = new Schema<IProductModel>(
  {
    name: { type: String, index: true },
    slug: { type: String, index: true },
    description: String,
    benefits: String,
    size: { type: String, index: true },
    originalPrice: { type: Number, index: true },
    discountPrice: { type: Number, index: true },
    percentageDiscount: Number,
    stockQty: Number,
    stockQtyAlert: Number,
    isFeatured: Boolean,
    image: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
    cover: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    duration: String, // to cook meal(Mealkit)
    servings: Number,
    calories: String,
    ingredients: {
      cover: {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
      main: [
        {
          quantity: String,
          item: String,
          _id: false,
        },
      ],
      others: [
        {
          quantity: String,
          item: String,
          _id: false,
        },
      ],
    },
    instructions: {
      cover: {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
      data: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [String],
    productSection: String,
    category: {
      type: Schema.Types.ObjectId,
      refPath: "ProductCategory",
      index: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      refPath: "ProductSubCategory",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IProductModel>("Product", productSchema);
