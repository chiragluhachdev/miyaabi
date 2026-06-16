import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "superadmin";
  createdAt: Date;
  updatedAt: Date;
}

interface IAdminMethods {
  matchPassword(plain: string): Promise<boolean>;
}

interface IAdminModel extends Model<IAdmin, object, IAdminMethods> {
  hashPassword(plain: string): Promise<string>;
}

const adminSchema = new Schema<IAdmin, IAdminModel, IAdminMethods>(
  {
    name: { type: String, default: "Admin" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  },
  { timestamps: true }
);

adminSchema.methods.matchPassword = function (plain: string) {
  return bcrypt.compare(plain, this.passwordHash);
};

adminSchema.statics.hashPassword = function (plain: string) {
  return bcrypt.hash(plain, 10);
};

export type AdminDoc = HydratedDocument<IAdmin, IAdminMethods>;

export default (mongoose.models.Admin as IAdminModel) ??
  mongoose.model<IAdmin, IAdminModel>("Admin", adminSchema);
