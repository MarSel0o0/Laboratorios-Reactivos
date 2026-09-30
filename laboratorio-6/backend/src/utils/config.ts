import dotenv from "dotenv";
dotenv.config();

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT;
const MONGODB_URI = process.env.NODE_ENV === "test" 
    ? process.env.TEST_MONGODB_URI 
    : process.env.MONGODB_URI;
const MONGODB_DBNAME = process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_DBNAME 
    : process.env.MONGODB_DBNAME;

export default { HOST, PORT, MONGODB_URI, MONGODB_DBNAME };