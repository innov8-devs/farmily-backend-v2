import { IImage } from "../Image/imageTypes";
import { IProductSection } from "../ProductSection/productSectionTypes";
export interface IProductCategory {
  _id: string;
  label: string;
  description: string;
  image: IImage;
  productSection: string;
  productSectionId: string | IProductSection;
}

export class CreateProductCategoryInput {
  productSection: string;
  productSectionId: string;
  label: string;
  description: string;
  image: string;
  cover?: string;
}

export class CreateBulkProductCategoriesInput {
  productCategories: CreateProductCategoryInput[];
}

export class UpdateProductCategoryInput {
  _id: string;
  payload: CreateProductCategoryInput;
}
