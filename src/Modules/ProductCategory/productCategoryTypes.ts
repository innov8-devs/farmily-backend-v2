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
