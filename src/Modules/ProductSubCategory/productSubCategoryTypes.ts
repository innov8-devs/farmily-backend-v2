import { IProductSection } from "../ProductSection/productSectionTypes";
export class CreateProductSubCategoryInput {
  label: string;
  description: string;
  image: string;
  category: string;
  productSection: string;
  productSectionId: string | IProductSection;
}
export interface IProductSubCategory extends CreateProductSubCategoryInput{
  _id: string;
}

export class UpdateProductSubCategoryInput {
  _id: string;
  payload: CreateProductSubCategoryInput;
}

export class GetAllProductSubCategoriesInput {
  category: string
  pageSize?: number;
  pageNumber?: number;
  sort?: 1 | -1;
}
