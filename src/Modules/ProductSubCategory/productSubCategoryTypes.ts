
export class CreateProductSubCategoryInput {
  label: string;
  description: string;
  image: string;
}

export class UpdateProductSubCategoryInput {
  _id: string;
  payload: CreateProductSubCategoryInput;
}

export class GetAllProductSubCategoriesInput {
  pageSize?: number;
  pageNumber?: number;
  sort?: 1 | -1;
}
