import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME;
const JWT_SECRET = process.env.JWT_SECRET || "my_secret";

if (!PORT) {
    throw new Error("PORT is not defined in the environment variables");
}
 
if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
}
 
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export default { PORT, HOST, MONGODB_URI, MONGODB_DBNAME, JWT_SECRET };
