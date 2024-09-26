import productSectionModel from './productSection.model';
import { BaseRepository } from '../../Repository';

/**
 * Repository class for interacting with the product section collection in the database.
 */
class ProductSectionRepository extends BaseRepository<any> {
  constructor() {
    super(productSectionModel);
  }
}

export default new ProductSectionRepository();
