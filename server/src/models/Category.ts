import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
  name: string;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
