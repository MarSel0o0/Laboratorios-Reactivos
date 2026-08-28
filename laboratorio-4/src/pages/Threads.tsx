// P2: página principal, con el listado de threads.
//
// Pide los threads al servidor con el módulo de servicios y los renderiza con
// el componente de P1. Recuerde que la llamada al servidor va dentro de un
// `useEffect` y su resultado en el estado del componente.
//
// P4: agregue el formulario al principio de la página. Aquí crea un thread.
//
import { useEffect, useState } from 'react'
import type { Post } from '../types/posts'
import threadsService from '../services/threads'
import PostBox from '../components/PostBox.tsx'
import PostForm from "../components/PostForm.tsx";

const Threads = () => {
  const [threads, setThreads] = useState<Post[]>([])
  const addThread = (data: { content: string, author?: string, parent?: number }) => {
    threadsService.create(data).then((thread) => {
      setThreads([...threads, thread])
    })
  }

  const handler = () => {
    threadsService.getAll().then((threads: Post[]) => {
      setThreads(threads)
    })
  }
  useEffect(handler, [])
  return (
    <>
      <div className="threads">
        <h2>
          Nuevo Hilo
        </h2>
        <PostForm onSubmit={addThread} />
        <h2>
          Hilos
        </h2>
        { threads.map((thread: Post) => (
          <PostBox post={thread} />
        )) }
      </div>
    </>
  )
}

export default Threads
