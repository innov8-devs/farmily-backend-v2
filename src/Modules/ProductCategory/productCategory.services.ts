import ProductCategoryRepository from "./productCategory.repository";
import { CreateProductCategoryInput } from "./productCategoryTypes";
import { IProductCategoryModel } from "./productCategory.model";

class ProductCategoryServices {
  public static async createProductCategory(data: CreateProductCategoryInput) {
    const productCategory = await ProductCategoryRepository.createOne(data);

    return productCategory;
  }

  public static async updateCategory(
    categoryId: string,
    data: CreateProductCategoryInput
  ): Promise<IProductCategoryModel | null> {
    const category = await ProductCategoryRepository.updateOne(
      { _id: categoryId },
      { ...data }
    );

    return category;
  }

  public static async getCategoryById(
    categoryId: string
  ): Promise<IProductCategoryModel | null> {
    const category = await ProductCategoryRepository.findOne({ _id: categoryId });

    return category;
  }

  public static async getAllCategoriesBySection(query: any) {
    const { pageNumber, pageSize, sort, section, sectionId } = query;
    const sectionInLowerCase = section && section.toLowerCase();
    const skip = (pageNumber - 1) * pageSize;

    return await ProductCategoryRepository.findMany(
      {
        $or: [
          { productSectionId: sectionId },
          { productSection: sectionInLowerCase },
        ],
      },
      { sort, skip, limit: pageSize, populate: ["image", "productSection"] }
    );
  }

  public static async deleteCategory(categoryId: string): Promise<void> {
    await ProductCategoryRepository.deleteOne({ _id: categoryId });
  }
}

export default ProductCategoryServices;
