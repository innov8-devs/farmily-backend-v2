import productModel, { IProductModel } from "./product.model";
import { BaseRepository } from "../../Repository";

/**
 * Repository class for managing Product data.
 */
class ProductRepository extends BaseRepository<IProductModel> {
  /**
   * Constructs a new instance of the ProductRepository.
   */
  constructor() {
    super(productModel);
  }

  async incrementViews(productId: string, views: number) {
    return await super.updateOne({ _id: productId }, { views: views + 1 });
  }

  async assignProductBrand(productId: string, productBrandId: string) {
    return await this.updateOne({ _id: productId }, { brand: productBrandId });
  }

  async unAssignProductBrand(productId: string, productBrandId: string) {
    return await this.updateOne({ _id: productId }, { brand: productBrandId });
  }

  async assignKeyword(productId: string, keywordId: string) {
    return await this.model.updateOne(
      { _id: productId },
      { $push: { keywords: keywordId } }
    );
  }

  async unAssignKeyword(productId: string, keywordId: string) {
    return await this.model.updateOne(
      { _id: productId },
      { $pull: { keywords: keywordId } }
    );
  }
}

export default new ProductRepository();
