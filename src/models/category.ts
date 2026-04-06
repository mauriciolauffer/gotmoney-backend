import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  idcategory: number;
  iduser: number;
  description: string;
  budget: number;
}

const categorySchema: Schema = new Schema(
    {
      idcategory: {
        type: Number,
      },
      iduser: {
        type: Number,
      },
      description: {
        type: String,
      },
      budget: {
        type: Number,
      },
    },
    {
      collection: 'Categories',
      timestamps: true,
    }
);

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
export default Category;
