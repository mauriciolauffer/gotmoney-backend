import { Temporal } from "temporal-polyfill";

export interface ITransaction {
  iduser: number;
  idtransaction: number;
  idaccount: number;
  idparent: number;
  idstatus: number;
  description: string;
  instalment: string;
  amount: number;
  type: string;
  startdate: Temporal.PlainDate;
  duedate: Temporal.PlainDate;
  tag: string;
  origin: string;
  createdAt?: Temporal.Instant;
  updatedAt?: Temporal.Instant;
}

export default ITransaction;
