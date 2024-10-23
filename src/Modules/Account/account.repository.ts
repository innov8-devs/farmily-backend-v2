import accountModel from './account.model';
import { BaseRepository } from '../../Repository';

class AccountRepository extends BaseRepository<any> {
  constructor() {
    super(accountModel);
  }

  async findOneAndPopulateAccountTypeId(filter): Promise<any> {
    return await this.model.findOne(filter).populate('accountTypeId').exec();
  }
}

export default new AccountRepository();