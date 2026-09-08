import mongoose from 'mongoose'

export const forbiddenAuthors = ['Huevito rey', 'Matias Toro', 'Memes es mal ramo']

export const postBoxSchema = new mongoose.Schema({
  content: { type: String, required: true ,length: { min: 1, max: 500 }},
  author: {
    type: String,
    default: null,
    validate: {
      validator: (author: string | null) =>
        !author || !forbiddenAuthors.includes(author.trim().toLowerCase()),
      message: 'Este nombre de autor no está permitido',
    },
  },
  thread: { type: Number, default: null },
  parent: { type: Number, default: null },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
}, {
  timestamps: true,
})


