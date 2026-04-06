import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAccountType extends Document {
  idtype: number;
  description: string;
  icon: string;
  inactive: boolean;
}

const accountTypeSchema: Schema = new Schema(
    {
      idtype: {
        type: Number,
      },
      description: {
        type: String,
      },
      icon: {
        type: String,
      },
      inactive: {
        type: Boolean,
      },
    },
    {
      collection: 'AccountTypes',
    }
);

export const AccountType: Model<IAccountType> = mongoose.models.AccountType || mongoose.model<IAccountType>('AccountType', accountTypeSchema);
export default AccountType;
