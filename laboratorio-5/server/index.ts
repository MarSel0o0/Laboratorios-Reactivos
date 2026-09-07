import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, default: null },
  thread: { type: Number, default: null },
  parent: { type: Number, default: null },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
}, {
  timestamps: true,
})

const Post = mongoose.model('Post', postSchema)

app.get('/threads', async (_request, response) => {
  const threads = await Post.find({ thread: null }).sort({ createdAt: 1 })
  response.json(threads)
})

app.post('/threads', async (request, response) => {
  const post = await Post.create({
    content: request.body.content,
    author: request.body.author,
    thread: null,
  })

  response.status(201).json(post)
})

app.put('/posts/:id', async (request, response) => {
  const post = await Post.findOneAndUpdate(
    { id: Number(request.params.id) },
    request.body,
    { new: true },
  )

  response.json(post)
})

async function start() {
  await mongoose.connect(process.env.MONGODB_URI as string)
  console.log('Conectado a MongoDB Atlas')

  app.listen(port, () => {
    console.log(`API ejecutándose en http://localhost:${port}`)
  })
}

start().catch(error => {
  console.error('Error conectando con MongoDB:', error)
  process.exit(1)
})