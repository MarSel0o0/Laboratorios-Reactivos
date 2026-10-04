import mongoose from "mongoose";

export interface UserData {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

// TODO (P1): campos, restricciones y transformación a JSON.
const userSchema = new mongoose.Schema<UserData>({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo invalido"],
  },
  passwordHash: { type: String, required: true },
});

const User = mongoose.model<UserData>("User", userSchema);

userSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      id?: string;
      _id?: mongoose.Types.ObjectId;
      __v?: number;
      passwordHash?: string;
    },
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

export default User;
