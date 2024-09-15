import customerModel from './customer.model';
import { BaseRepository } from '../../Repository';

/**
 * Repository class for interacting with the customer collection in the database.
 */
class CustomerRepository extends BaseRepository<any> {
  constructor() {
    super(customerModel);
  }
}

export default new CustomerRepository();
