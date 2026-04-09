import { IAccountType } from "../models/accounttype";

export class AccountType {
  db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async getAll(): Promise<IAccountType[]> {
    try {
      const { results } = await this.db.prepare("SELECT * FROM AccountTypes").all<IAccountType>();
      return results || [];
    } catch (err: any) {
      err.status = 404;
      err.code = "NOT_FOUND";
      throw err;
    }
  }
}

export default AccountType;
