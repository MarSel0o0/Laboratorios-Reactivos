import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { postBoxSchema } from './components/postBox'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())


const Post = mongoose.model('Post', postBoxSchema)

postBoxSchema.set("toJSON", { 
transform: ( 
document, 
returnedObject: { 
            id?: string | undefined; 
            _id?: mongoose.Types.ObjectId; 
            __v?: number;
        }, 
    ) =>{returnedObject.id = returnedObject._id?.toString(); 
delete returnedObject._id; 
delete returnedObject.__v; },
});

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