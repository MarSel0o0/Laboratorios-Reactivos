import mongoose from "mongoose";
export declare const Post: mongoose.Model<{
    content: string;
    likes: number;
    dislikes: number;
    author?: string | null;
    thread?: string | null;
    parent?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    content: string;
    likes: number;
    dislikes: number;
    author?: string | null;
    thread?: string | null;
    parent?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    content: string;
    likes: number;
    dislikes: number;
    author?: string | null;
    thread?: string | null;
    parent?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    content: string;
    likes: number;
    dislikes: number;
    author?: string | null;
    thread?: string | null;
    parent?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    content: string;
    likes: number;
    dislikes: number;
    author?: string | null;
    thread?: string | null;
    parent?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    content: string;
    likes: number;
    dislikes: number;
    author?: string | null;
    thread?: string | null;
    parent?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    content: string;
    likes: number;
    dislikes: number;
    author?: string | null;
    thread?: string | null;
    parent?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    content: string;
    likes: number;
    dislikes: number;
    author?: string | null;
    thread?: string | null;
    parent?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=post.d.ts.map