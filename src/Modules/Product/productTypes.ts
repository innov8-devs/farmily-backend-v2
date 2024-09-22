import { IImage } from "../Image/imageTypes";

export interface IProduct {
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
  productSectionId: string;
}
