import mongoose, { Schema, Document } from 'mongoose';

interface OrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  total: number;
  phone: string;
  wilaya: string;
  isConfirmed: boolean;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true },
    phone: { type: String, required: true },
    wilaya: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
