import mongoose from "mongoose";

export interface UserData {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}
const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
function validateregex (email: string){
  return emailregex.test(email)
}
// TODO (P1): campos, restricciones y transformación a JSON.
const userSchema = new mongoose.Schema<UserData>({
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true, validate: {
    validator:
     function (email:string) {
      return validateregex(email)
    },
    message : "Ta malo"
  }
  },
  passwordHash: { type: String, required: true},
});

const User = mongoose.model<UserData>("User", userSchema);

userSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      id?: String;
      _id?: mongoose.Types.ObjectId;
      __v?: number;
      passwordHash?: String;
    }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

export default User;
