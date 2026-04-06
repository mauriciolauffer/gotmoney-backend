import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
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
}

const transactionSchema: Schema = new Schema(
    {
      iduser: {
        type: Number,
      },
      idtransaction: {
        type: Number,
      },
      idaccount: {
        type: Number,
      },
      idparent: {
        type: Number,
      },
      idstatus: {
        type: Number,
      },
      description: {
        type: String,
      },
      instalment: {
        type: String,
      },
      amount: {
        type: Number,
      },
      type: {
        type: String,
      },
      startdate: {
        type: Date,
      },
      duedate: {
        type: Date,
      },
      tag: {
        type: String,
      },
      origin: {
        type: String,
      },
    },
    {
      collection: 'Transactions',
      timestamps: true,
    }
);

export const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
