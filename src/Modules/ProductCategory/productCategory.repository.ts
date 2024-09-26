import productCategoryModel from './productCategory.model';
import { BaseRepository } from '../../Repository';

/**
 * Repository class for interacting with the productCategory collection in the database.
 */
class ProductCategoryRepository extends BaseRepository<any> {
  constructor() {
    super(productCategoryModel);
  }

  /**
   * Assigns a product sub-category to a product category.
   *
   * @param {any} filter - The filter criteria to match the product category.
   * @param {string} productSubCategoryId - The ID of the product sub-category to assign.
   * @returns {Promise<any>} A promise representing the update operation result.
   */
  async assignProductSubCategoryToProductCategory(filter: any, productSubCategoryId: string): Promise<any> {
    return await this.model.updateOne(filter, { $push: { subCategories: productSubCategoryId } });
  }

  /**
   * Unassigns a product sub-category from a product category.
   *
   * @param {any} filter - The filter criteria to match the product category.
   * @param {string} productSubCategoryId - The ID of the product sub-category to unassign.
   * @returns {Promise<any>} A promise representing the update operation result.
   */
  async unAssignProductSubCategoryFromProductCategory(filter: any, productSubCategoryId: string): Promise<any> {
    return await this.model.updateOne(filter, { $pull: { subCategories: productSubCategoryId } });
  }
}

export default new ProductCategoryRepository();
