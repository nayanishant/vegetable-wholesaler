import mongoose, { Schema } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  image?: string;
  role?: "user" | "admin";
  _id?: mongoose.Types.ObjectId;
  provider?: "google";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: number;
    country?: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["google"],
      default: "google",
    },
    address: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: Number,
        country: { type: String, default: "IN" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
