import mongoose from "mongoose";

export interface UserData {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

// TODO (P1): campos, restricciones y transformación a JSON.
const userSchema = new mongoose.Schema<UserData>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        // Validación de formato de correo electrónico
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Por favor, introduce un correo electrónico válido.",
    },
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

userSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      id?: string | undefined;
      _id?: mongoose.Types.ObjectId | undefined;
      __v?: number | undefined;
      passwordHash?: string | undefined;
    },
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash; // Excluir el campo passwordHash al convertir a JSON
  }
});

const User = mongoose.model<UserData>("User", userSchema);

export default User;
