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
  startdate: Date;
  duedate: Date;
  tag: string;
  origin: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default ITransaction;
