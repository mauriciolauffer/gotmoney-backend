import { Temporal } from "temporal-polyfill";
import { ITransaction } from "../models/transaction";
import CustomErrors from "../utils/errors";

export class Transaction {
  props: ITransaction;
  db: D1Database;

  constructor(db: D1Database, data: any = {}) {
    this.db = db;
    this.props = this.setProperties(data);
  }

  setProperties({
    iduser,
    idtransaction,
    idaccount,
    idparent,
    idstatus,
    description,
    instalment,
    amount,
    type,
    startdate,
    duedate,
    tag,
    origin,
  }: any): ITransaction {
    return {
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
    const result = await this.db
      .prepare("SELECT * FROM Transactions WHERE iduser = ? AND idtransaction = ?")
      .bind(iduser, idtransaction)
      .first<ITransaction>();

    if (result) {
      return new Transaction(this.db, result);
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }

  async getAll(iduser: number): Promise<ITransaction[]> {
    const { results } = await this.db
      .prepare("SELECT * FROM Transactions WHERE iduser = ? ORDER BY duedate ASC")
      .bind(iduser)
      .all<ITransaction>();

    return results || [];
  }

  async findByPeriod(iduser: number, year: number, month: number): Promise<ITransaction[]> {
    const firstDay = Temporal.PlainDate.from({ year, month, day: 1 }).toString();
    const lastDay = Temporal.PlainDate.from({ year, month, day: 1 })
      .with({ day: Temporal.PlainDate.from({ year, month, day: 1 }).daysInMonth })
      .toString();

    const { results } = await this.db
      .prepare(
        "SELECT * FROM Transactions WHERE iduser = ? AND duedate >= ? AND duedate <= ? ORDER BY duedate ASC",
      )
      .bind(iduser, firstDay, lastDay)
      .all<ITransaction>();

    return results || [];
  }

  async findOverdue(iduser: number): Promise<ITransaction[]> {
    const now = Temporal.Now.plainDateISO().toString();
    const { results } = await this.db
      .prepare("SELECT * FROM Transactions WHERE iduser = ? AND duedate < ? ORDER BY duedate ASC")
      .bind(iduser, now)
      .all<ITransaction>();

    return results || [];
  }

  async create(): Promise<any> {
    return this.db
      .prepare(
        "INSERT INTO Transactions (idtransaction, iduser, idaccount, idparent, idstatus, description, instalment, amount, type, startdate, duedate, tag, origin, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(
        this.props.idtransaction,
        this.props.iduser,
        this.props.idaccount,
        this.props.idparent,
        this.props.idstatus,
        this.props.description,
        this.props.instalment,
        this.props.amount,
        this.props.type,
        this.props.startdate instanceof Temporal.PlainDate
          ? this.props.startdate.toString()
          : this.props.startdate,
        this.props.duedate instanceof Temporal.PlainDate ? this.props.duedate.toString() : this.props.duedate,
        this.props.tag,
        this.props.origin,
        Temporal.Now.instant().toString(),
        Temporal.Now.instant().toString(),
      )
      .run();
  }

  async createBatch(payload: any[]): Promise<any> {
    const statements = payload.map((p) => {
      return this.db
        .prepare(
          "INSERT INTO Transactions (idtransaction, iduser, idaccount, idparent, idstatus, description, instalment, amount, type, startdate, duedate, tag, origin, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(
          p.idtransaction,
          p.iduser,
          p.idaccount,
          p.idparent,
          p.idstatus,
          p.description,
          p.instalment,
          p.amount,
          p.type,
          p.startdate instanceof Temporal.PlainDate ? p.startdate.toString() : p.startdate,
          p.duedate instanceof Temporal.PlainDate ? p.duedate.toString() : p.duedate,
          p.tag,
          p.origin,
          Temporal.Now.instant().toString(),
          Temporal.Now.instant().toString(),
        );
    });
    return this.db.batch(statements);
  }

  async update(): Promise<any> {
    const result = await this.db
      .prepare(
        "UPDATE Transactions SET idaccount = ?, idstatus = ?, description = ?, instalment = ?, amount = ?, type = ?, startdate = ?, duedate = ?, tag = ?, origin = ?, updatedAt = ? WHERE iduser = ? AND idtransaction = ?",
      )
      .bind(
        this.props.idaccount,
        this.props.idstatus,
        this.props.description,
        this.props.instalment,
        this.props.amount,
        this.props.type,
        this.props.startdate instanceof Temporal.PlainDate
          ? this.props.startdate.toString()
          : this.props.startdate,
        this.props.duedate instanceof Temporal.PlainDate ? this.props.duedate.toString() : this.props.duedate,
        this.props.tag,
        this.props.origin,
        Temporal.Now.instant().toString(),
        this.props.iduser,
        this.props.idtransaction,
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
      .prepare("DELETE FROM Transactions WHERE iduser = ? AND idtransaction = ?")
      .bind(this.props.iduser, this.props.idtransaction)
      .run();

    if (result.meta.changes > 0) {
      return result;
    } else {
      throw CustomErrors.HTTP.get404();
    }
  }
}

export default Transaction;
