"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const url = process.env.MONGODB_URI;
mongoose_1.default.set("strictQuery", false);
if (url) {
    mongoose_1.default
        .connect(url)
        .then(() => console.log("connected to MongoDB"))
        .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });
}
else {
    console.log("MONGODB_URI is not set");
}
//# sourceMappingURL=db.js.map