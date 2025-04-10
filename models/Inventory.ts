import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  name: string;
  description?: string;
  image?: string;
  price: number;
  unit: string;
  stock: number;
  category?: string;
  isAvailable: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "piece", "bundle", "pack"],
      default: "kg",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Inventory =
  mongoose.models.Inventory || mongoose.model<IInventory>("Inventory", inventorySchema);

export default Inventory;
