import productSubCategoryModel from './productSubCategory.model';
import { BaseRepository } from '../../Repository';

/**
 * Repository class for interacting with the ProductSubCategory collection in the database.
 */
class ProductSubCategoryRepository extends BaseRepository<any> {
  constructor() {
    super(productSubCategoryModel);
  }
}

export default new ProductSubCategoryRepository();
