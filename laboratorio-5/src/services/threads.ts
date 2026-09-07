import axios from 'axios'
import type { Post } from '../types/posts'

const baseUrl = `/threads`

const getAll = async () => {
  const request = axios.get<Post[]>(`${baseUrl}/`)
  return await request.then(response => response.data)
}

interface ThreadAnswer {
  thread: Post
  comments: Post[]
}
const getThread = async (id: string) => {
  const request = axios.get<ThreadAnswer>(`${baseUrl}/${id}`)
  return await request.then(response => response.data)
}

interface ThreadCreateData {
  content: string
  author?: string
}
const create = async (data: ThreadCreateData) => {
  return await axios.post<Post>(`${baseUrl}`, data).then(request => request.data)
}

interface CommentCreateData {
  content: string
  author?: string
  parent?: number
}
const createComment = async (data: CommentCreateData, threadId: number) => {
  return await axios.post<Post>(`${baseUrl}/${threadId}`, data).then(request => request.data)
}

const update = async (id: number, newObject: Post) => {
  return await axios
    .put<Post>(`/posts/${id}`, newObject)
    .then(request => request.data)
}

export default {
  getAll,
  getThread,
  create,
  createComment,
  update,
}
