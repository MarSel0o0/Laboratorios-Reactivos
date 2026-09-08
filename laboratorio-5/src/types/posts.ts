export interface Post {
  id: string
  content: string
  author: string | null
  thread: string | null // null si es thread, un id si es comentario
  parent: string | null // null si no responde a nadie o el id del respondido
  createdAt: string
  updatedAt: string
  likes: number
  dislikes: number
}
