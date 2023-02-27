import { Document, model, Schema, Model } from 'mongoose';

export interface Order extends Document {
  makerAddress: string;
  takerAddress: string;
  sellToken: string;
  buyToken: string;
  sellAmount: number;
  buyAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema({
  makerAddress: { type: String, required: true },
  takerAddress: { type: String },
  sellToken: { type: String, required: true },
  buyToken: { type: String, required: true },
  sellAmount: { type: Number, required: true },
  buyAmount: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const OrderModel: Model<Order> = model<Order>('Order', OrderSchema);
