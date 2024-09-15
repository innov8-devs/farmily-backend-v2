import { BaseRepository } from '../../Repository';
import wishListModel from './wishList.model';

/**
 * Repository class for interacting with the wishlist collection in the database.
 */
class WishListRepository extends BaseRepository<any> {
  constructor() {
    super(wishListModel);
  }
}

export default new WishListRepository();
