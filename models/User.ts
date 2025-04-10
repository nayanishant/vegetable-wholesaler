import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  name: string;
  role?: "user" | "admin";
  _id?: mongoose.Types.ObjectId;
  provider?: "credentials" | "google";
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    address: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: Number,
        country: { type: String, default: "IN" },
      }
    ],    
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
