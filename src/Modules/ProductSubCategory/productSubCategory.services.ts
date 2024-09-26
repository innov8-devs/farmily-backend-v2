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

      if (updatedProductSubCategory.matchedCount === 0) {
        throw new NotFoundException("SUB CATEGORY NOT FOUND");
      }

      if (updatedProductSubCategory.modifiedCount === 0) {
        throw new InternalServerException("UPDATE FAILED");
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

  public static async getAllProductSubCategories(
    data: GetAllProductSubCategoriesInput
  ) {
    const foundSubProductCategories =
      await ProductSubCategoryRepository.aggregate([
        { $sort: { createdAt: data.sort } },
        { $skip: data.pageSize * (data.pageNumber - 1) },
        { $limit: data.pageSize },
      ]);

    if (foundSubProductCategories.length === 0) {
      throw new NotFoundException("SUB CATEGORIES NOT FOUND");
    }
    const populatedProductSubCategories =
      await ProductSubCategoryRepository.populate(
        [foundSubProductCategories],
        ["image"],
        ["Image"]
      );

    return populatedProductSubCategories[0];
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
        ["image"],
        ["Image"]
      );

    return populatedProductSubCategory[0];
  }
}
