import db from '../models/accounttype';

export class AccountType {
  async getAll(): Promise<any[]> {
    try {
      const docs = await db.find({}).lean().exec();
      return docs || [];
    } catch (err: any) {
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }
  }
}

export default AccountType;
