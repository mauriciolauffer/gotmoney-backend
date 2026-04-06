import { IAccount } from "../models/account";
import CustomErrors from "../utils/errors";

export class Account {
  props: IAccount;
  db: D1Database;

  constructor(db: D1Database, data: any = {}) {
    this.db = db;
    this.props = this.setProperties(data);
  }

  setProperties({
    iduser,
    idaccount,
    idtype,
    description,
    creditlimit,
    balance,
    openingdate,
    duedate,
  }: any): IAccount {
    return {
      iduser,
      idaccount,
      idtype,
      description,
      creditlimit: creditlimit || 0,
      balance: balance || 0,
      openingdate,
      duedate,
    };
  }

  getProperties() {
    return { ...this.props };
  }

  async findById(iduser: number, idaccount: number): Promise<Account> {
    const result = await this.db
      .prepare("SELECT * FROM Accounts WHERE iduser = ? AND idaccount = ?")
      .bind(iduser, idaccount)
      .first<IAccount>();

    if (result) {
      return new Account(this.db, result);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async getAll(iduser: number): Promise<IAccount[]> {
    const { results } = await this.db
      .prepare("SELECT * FROM Accounts WHERE iduser = ? ORDER BY description ASC")
      .bind(iduser)
      .all<IAccount>();

    return results || [];
  }

  async create(): Promise<any> {
    return this.db
      .prepare(
        "INSERT INTO Accounts (idaccount, iduser, idtype, description, creditlimit, balance, openingdate, duedate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(
        this.props.idaccount,
        this.props.iduser,
        this.props.idtype,
        this.props.description,
        this.props.creditlimit,
        this.props.balance,
        this.props.openingdate instanceof Date
          ? this.props.openingdate.toISOString()
          : this.props.openingdate,
        this.props.duedate,
        new Date().toISOString(),
        new Date().toISOString(),
      )
      .run();
  }

  async update(): Promise<any> {
    const result = await this.db
      .prepare(
        "UPDATE Accounts SET idtype = ?, description = ?, creditlimit = ?, balance = ?, openingdate = ?, duedate = ?, updatedAt = ? WHERE iduser = ? AND idaccount = ?",
      )
      .bind(
        this.props.idtype,
        this.props.description,
        this.props.creditlimit,
        this.props.balance,
        this.props.openingdate instanceof Date
          ? this.props.openingdate.toISOString()
          : this.props.openingdate,
        this.props.duedate,
        new Date().toISOString(),
        this.props.iduser,
        this.props.idaccount,
      )
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async delete(): Promise<any> {
    const result = await this.db
      .prepare("DELETE FROM Accounts WHERE iduser = ? AND idaccount = ?")
      .bind(this.props.iduser, this.props.idaccount)
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }
}

export default Account;
