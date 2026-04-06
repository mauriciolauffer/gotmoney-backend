import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  iduser: number;
  email: string;
  name: string;
  passwd?: string;
  alert: boolean;
  active: boolean;
  facebook?: string;
  google?: string;
  twitter?: string;
  createdon: Date;
}

const userSchema: Schema = new Schema(
    {
      iduser: {
        type: Number,
      },
      email: {
        type: String,
      },
      name: {
        type: String,
      },
      passwd: {
        type: String,
      },
      alert: {
        type: Boolean,
      },
      active: {
        type: Boolean,
      },
      facebook: {
        type: String,
      },
      google: {
        type: String,
      },
      twitter: {
        type: String,
      },
      createdon: {
        type: Date,
      },
    },
    {
      collection: 'Users',
      timestamps: true,
    }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
