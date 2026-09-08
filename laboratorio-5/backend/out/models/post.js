"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FORBIDDEN_AUTHORS = ["Huevito rey", "Matías Toro", "Memes es mal ramo"];
const postSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 300,
    },
    author: {
        type: String,
        default: null,
        validate: {
            validator: function (value) {
                if (!value)
                    return true;
                return !FORBIDDEN_AUTHORS.includes(value);
            },
            message: "El autor no está permitido."
        },
    },
    thread: {
        type: String,
        default: null,
    },
    parent: {
        type: String,
        default: null,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
postSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        var _a;
        returnedObject.id = (_a = returnedObject._id) === null || _a === void 0 ? void 0 : _a.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.Post = mongoose_1.default.model("Post", postSchema);
//# sourceMappingURL=post.js.map