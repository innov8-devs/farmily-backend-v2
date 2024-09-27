import {
  InternalServerException,
  NotFoundException,
} from "../../Shared/Exceptions";
import ProductSubCategoryRepository from "./productSubCategory.repository";
import {
  CreateProductSubCategoryInput,
  UpdateProductSubCategoryInput,
  GetAllProductSubCategoriesInput,
} from "./productSubCategoryTypes";

/**
 * Service class for product sub-category.
 */
export class ProductSubCategoryServices {
  public static async createProductSubCategory(
    data: CreateProductSubCategoryInput
  ) {
    try {
      const createdProductSubCategory =
        await ProductSubCategoryRepository.createOne(data);


      if (!createdProductSubCategory) {
        throw new InternalServerException("CREATION FAILED");
      }

      const populatedProductSubCategory =
        await ProductSubCategoryRepository.populate(
          [createdProductSubCategory],
          ["image"],
          ["Image"]
        );

      return populatedProductSubCategory[0];
    } catch (error) {
      if (error.code == "11000") {
        throw new Error("ALREADY ADDED");
      }
      console.error({ error });
    }
  }

  public static async updateProductSubCategory(
    data: UpdateProductSubCategoryInput
  ) {
    try {
      let updatedProductSubCategory =
        await ProductSubCategoryRepository.updateOne(
          { _id: data._id },
          data.payload
        );

      if (!updatedProductSubCategory) {
        throw new NotFoundException("SUB CATEGORY NOT FOUND");
      }

      updatedProductSubCategory = await this.getProductSubCategory({
        _id: data._id,
      });

      const populatedProductSubCategory =
        await ProductSubCategoryRepository.populate(
          [updatedProductSubCategory],
          ["image"],
          ["Image"]
        );

      return populatedProductSubCategory[0];
    } catch (error) {
      if (error.code == "11000") {
        throw new Error("ALREADY ADDED");
      }
      console.error({ error });
    }
  }

  public static async deleteProductSubCategory(productSubCategoryId: string) {
    const deletedProductSubCategory =
      await ProductSubCategoryRepository.deleteOne({
        _id: productSubCategoryId,
      });

    if (deletedProductSubCategory.deletedCount === 0)
      throw new InternalServerException("DELETION FAILED");

    return "DELETED SUCCESSFULLY";
  }

  public static async getAllProductSubCategories(query: any) {
    const { pageNumber, pageSize, sort, category, productSectionId } = query;
    const skip = (pageNumber - 1) * pageSize;

    return await ProductSubCategoryRepository.findMany(
      {
        $or: [{ category }, { productSectionId }],
      },
      { sort, skip, limit: pageSize, populate: ["image"] }
    );
  }

  public static async getProductSubCategory(filter: any) {
    const foundProductSubCategory = await ProductSubCategoryRepository.findOne(
      filter
    );

    if (!foundProductSubCategory)
      throw new InternalServerException("SUB CATEGORY NOT FOUND");

    const populatedProductSubCategory =
      await ProductSubCategoryRepository.populate(
        [foundProductSubCategory],
        ["image", "category"],
        ["Image", "ProductCategory"]
      );

    return populatedProductSubCategory[0];
  }
}
