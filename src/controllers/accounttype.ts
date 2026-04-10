import { IAccountType } from "../models/accounttype";
import CustomErrors from "../utils/errors";
import { BaseController } from "./base";

export class AccountType extends BaseController<IAccountType[]> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setProperties(_data: any): IAccountType[] {
    return [];
  }

  async getAll(): Promise<IAccountType[]> {
    try {
      const { results } = await this.db.prepare("SELECT * FROM AccountTypes").all<IAccountType>();
      return results || [];
    } catch (err: any) {
      throw CustomErrors.HTTP.get404(err.message);
    }
  }
}

export default AccountType;
