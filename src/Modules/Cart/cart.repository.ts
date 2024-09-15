import cartModel from './cart.model';
import { BaseRepository } from '../../Repository';

/**
 * Repository class for interacting with the Cart collection in the database.
 */
class CartRepository extends BaseRepository<any> {
  constructor() {
    super(cartModel);
  }
}

export default new CartRepository();
