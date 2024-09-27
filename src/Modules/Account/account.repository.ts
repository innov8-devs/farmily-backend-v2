import accountModel from './account.model';
import { BaseRepository } from '../../Repository';
// import { FilterQuery } from 'mongoose';

class AccountRepository extends BaseRepository<any> {
  constructor() {
    super(accountModel);
  }

  // async findOne(filter: FilterQuery<any>): Promise<any> {
  //   return await this.model.findOne(filter).populate('accountTypeId').exec();
  // }
}

export default new AccountRepository();