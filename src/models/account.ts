import { Temporal } from "temporal-polyfill";

export interface IAccount {
  idaccount: number;
  iduser: number;
  idtype: number;
  description: string;
  creditlimit: number;
  balance: number;
  openingdate: Temporal.PlainDate;
  duedate: number;
  createdAt?: Temporal.Instant;
  updatedAt?: Temporal.Instant;
}

export default IAccount;
