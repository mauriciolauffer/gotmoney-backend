import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAccount extends Document {
  idaccount: number;
  iduser: number;
  idtype: number;
  description: string;
  creditlimit: number;
  balance: number;
  openingdate: Date;
  duedate: number;
}

const accountSchema: Schema = new Schema(
    {
      idaccount: {
        type: Number,
      },
      iduser: {
        type: Number,
      },
      idtype: {
        type: Number,
      },
      description: {
        type: String,
      },
      creditlimit: {
        type: Number,
      },
      balance: {
        type: Number,
      },
      openingdate: {
        type: Date,
      },
      duedate: {
        type: Number,
      },
    },
    {
      collection: 'Accounts',
      timestamps: true,
    }
);

export const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>('Account', accountSchema);
export default Account;
