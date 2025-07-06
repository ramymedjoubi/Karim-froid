import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: mongoose.Schema.Types.ObjectId;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
