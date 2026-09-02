// P3: vista detallada de un thread, con el thread y su listado de comentarios.
//
// El id del thread viene de la ruta. Con React Router se obtiene con
// `useParams`; si resuelve la navegación de otra forma, tendrá que recibirlo
// por props.
//
// P4: agregue el formulario al principio, que aquí crea un comentario, y el
// formulario desplegable de respuesta debajo de cada comentario.
//
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Post } from '../types/posts'
import threadsService from '../services/threads'
import PostForm from '../components/PostForm.tsx'
import CommentTree from '../components/CommentTree.tsx'

const Thread = () => {
  const [thread, setThread] = useState<Post>({} as Post)
  const [comments, setComments] = useState<Post[]>([])
  const { id } = useParams()
  const getThread = () => {
    if (id) {
      threadsService.getThread(id).then((thread) => {
        setThread(thread.thread)
        setComments(thread.comments)
      })
    }
  }

  useEffect(getThread, [id])

  const addComment = (data: { content: string, author?: string, parent?: number }) => {
    threadsService.createComment(data, Number(id)).then((newComment) => {
      setComments([...comments, newComment])
    })
  }

  return (
    <>
      <div className="thread-container">
        <h2>
          { `Hilo #${thread.id}` }
        </h2>
        <p className="thread-title">
          { `Autor -  ${thread.author ? thread.author : 'Anónimo'}` }
        </p>
        <p className="thread-content">
          { thread.content }
        </p>
        <PostForm onSubmit={addComment} />
        <div className="comments">
          <h2>
            Comentarios
          </h2>
          { comments && comments.length > 0
            ? comments
                .filter(c => c.parent === null) // Primero renderizamos solo los comentarios raíz (los que responden directo al thread)
                .map((comment: Post) => (
                  <CommentTree key={comment.id} comment={comment} allComments={comments} onReply={addComment} />
                ))
            : 'No comments yet.'}
        </div>
      </div>
    </>
  )
}

export default Thread
