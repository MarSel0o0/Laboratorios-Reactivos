import mongoose, { Schema } from 'mongoose'
import config from '../utils/config'



const url = config.MONGODB_URI;
const dbName = config.MONGODB_DBNAME;

mongoose.set("strictQuery", false);
if (url) {
  mongoose.connect(url, { dbName }).catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
}

export interface Post {
  content: string
  author?: string
  thread?: mongoose.Types.ObjectId
  parent?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  likes: number
  dislikes: number
}

const BANNED = ["huevito rey", "matías toro", "memes es mal ramo"];
function isNotBanned(v: string) {
  return !BANNED.includes(v.toLowerCase());
}

const postSchema = new mongoose.Schema<Post>({
  content: { type: String, required: true, minlength: 1, maxlength: 300 },
  author: { type: String, validate: {
    validator: function(v: string) {
      return isNotBanned(v);
    },
    message: props => `${props.value} is not allowed as a username!`
  }},
  thread: { type: Schema.Types.ObjectId, ref: "Post", default: null },
  parent: { type: Schema.Types.ObjectId, ref: "Post", default: null },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
}, { 
  timestamps: true 
}); 

const PostModel = mongoose.model<Post>("Post", postSchema);

postSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default PostModel;