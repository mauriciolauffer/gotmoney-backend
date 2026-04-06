import db from '../models/account';
import CustomErrors from '../utils/errors';

export class Account {
  props: any;

  constructor(data: any = {}) {
    this.setProperties(data);
  }

  setProperties({ iduser, idaccount, idtype, description, creditlimit, balance, openingdate, duedate }: any) {
    this.props = {
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
    const docs = await db.findOne({ iduser, idaccount }).lean().exec();
    if (docs) {
      return new Account(docs);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async getAll(iduser: number): Promise<any[]> {
    const docs = await db.find({ iduser }).sort({ description: 1 }).lean().exec();
    return docs || [];
  }

  async create(): Promise<any> {
    return db.create(this.props);
  }

  async update(): Promise<any> {
    const docs = await db.findOneAndUpdate(
      { iduser: this.props.iduser, idaccount: this.props.idaccount },
      {
        idtype: this.props.idtype,
        description: this.props.description,
        creditlimit: this.props.creditlimit,
        balance: this.props.balance,
        openingdate: this.props.openingdate,
        duedate: this.props.duedate,
      }
    ).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async delete(): Promise<any> {
    const docs = await db.findOneAndDelete({
      iduser: this.props.iduser,
      idaccount: this.props.idaccount,
    }).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }
}

export default Account;
