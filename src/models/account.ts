export interface IAccount {
  idaccount: number;
  iduser: number;
  idtype: number;
  description: string;
  creditlimit: number;
  balance: number;
  openingdate: Date;
  duedate: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IAccount;
