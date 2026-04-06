import db from '../models/transaction';
import CustomErrors from '../utils/errors';

export class Transaction {
  props: any;

  constructor(data: any = {}) {
    this.setProperties(data);
  }

  setProperties({ iduser, idtransaction, idaccount, idparent, idstatus, description, instalment, amount, type, startdate, duedate, tag, origin }: any) {
    this.props = {
      iduser,
      idtransaction,
      idaccount,
      idparent,
      idstatus,
      description,
      instalment,
      amount: amount || 0,
      type,
      startdate,
      duedate,
      tag,
      origin,
    };
  }

  getProperties() {
    return { ...this.props };
  }

  async findById(iduser: number, idtransaction: number): Promise<Transaction> {
    const docs = await db.findOne({ iduser, idtransaction }).lean().exec();
    if (docs) {
      return new Transaction(docs);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async getAll(iduser: number): Promise<any[]> {
    const docs = await db.find({ iduser }).sort({ duedate: 1 }).lean().exec();
    return docs || [];
  }

  async findByPeriod(iduser: number, year: number, month: number): Promise<any[]> {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
    const docs = await db.find({
      iduser,
      duedate: { $gt: firstDay, $lt: lastDay },
    }).sort({ duedate: 1 }).lean().exec();
    return docs || [];
  }

  async findOverdue(iduser: number): Promise<any[]> {
    const docs = await db.find({
      iduser,
      duedate: { $lt: new Date() },
    }).sort({ duedate: 1 }).lean().exec();
    return docs || [];
  }

  async create(): Promise<any> {
    return db.create(this.props);
  }

  async createBatch(payload: any[]): Promise<any[]> {
    return db.insertMany(payload);
  }

  async update(): Promise<any> {
    const docs = await db.findOneAndUpdate(
      { iduser: this.props.iduser, idtransaction: this.props.idtransaction },
      {
        idaccount: this.props.idaccount,
        idstatus: this.props.idstatus,
        description: this.props.description,
        instalment: this.props.instalment,
        amount: this.props.amount,
        type: this.props.type,
        startdate: this.props.startdate,
        duedate: this.props.duedate,
        tag: this.props.tag,
        origin: this.props.origin,
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
      idtransaction: this.props.idtransaction,
    }).lean().exec();
    if (docs) {
      return docs;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }
}

export default Transaction;
