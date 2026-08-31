// P3: agregue aquí una estructura clickeable para entrar a la vista detallada
// del thread.

// P5: muestre la cantidad de likes y dislikes, con un botón para cada uno. El
// número debe cambiar sin recargar la página, así que conviene guardarlo en el
// estado del componente además de mandarlo al servidor.
//

import './postservices.css'
import type { Post } from '../types/posts'
import { Link } from 'react-router-dom'

import { useState } from 'react'
import PostForm from './PostForm.tsx'

import threadsService from '../services/threads'

interface PostBoxProps {
  post: Post
  onReply?: (data: { content: string, author?: string, parent?: number }) => void
}

const PostBox = ({ post, onReply }: PostBoxProps) => {
  const [isReplying, setIsReplying] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [dislikes, setDislikes] = useState(post.dislikes)

  const handleLike = () => {
    const newLikes = likes + 1
    threadsService.update(post.id, { ...post, likes: newLikes }).then(() => {
      setLikes(newLikes)
    })
  }

  const handleDislike = () => {
    const newDislikes = dislikes + 1
    threadsService.update(post.id, { ...post, dislikes: newDislikes }).then(() => {
      setDislikes(newDislikes)
    })
  }

  const showPost = (parentId?: number) => {
    // Si recibe un parentId, significa que es una respuesta a otro comentario
    return (
      <>
        <div className="post-box" style={{ position: 'relative' }}>
          <p className="post-title">
            { post.author === null ? 'Anónimo' : post.author }
          </p>
          {parentId
            ? (
                <div className="post-reply-context">
                  { `Respuesta al post #${parentId}` }
                </div>
              )
            : null}
          <p className="post-text">
            { post.content }
          </p>

          <div className="post-actions">
            {/* Botón de respuesta si tenemos onReply (es decir, en el detalle del thread) */}
            {onReply && post.thread !== null && (
              <button onClick={() => setIsReplying(!isReplying)} className="reply-btn">
                {isReplying ? 'Cancelar respuesta' : 'Responder a este comentario'}
              </button>
            )}
            
            <div className="reaction-buttons">
              <button onClick={handleLike} className="reaction-btn like-btn">
                👍 {likes}
              </button>
              <button onClick={handleDislike} className="reaction-btn dislike-btn">
                👎 {dislikes}
              </button>
            </div>
          </div>

          {onReply && post.thread !== null && isReplying && (
            <div style={{ marginTop: '10px' }}>
              <PostForm
                parentId={post.id}
                onSubmit={(data) => {
                  onReply(data)
                  setIsReplying(false)
                }}
              />
            </div>
          )}

          {post.thread === null && (
            <Link to={`/threads/${post.id}`} className="thread-link">
              Ver hilo completo
            </Link>
          )}
        </div>
      </>
    )
  }
  // Caso en el que es un thread padre.
  if (post.thread === null) {
    return showPost()
  }
  // Si es un comentario, le pasamos post.parent.
  // Si responde al hilo principal, post.parent es null y no muestra el cartel de "Respuesta al post...".
  // Si responde a un comentario, post.parent tendrá el ID y se aplicará el estilo reply-box.
  return showPost(post.parent !== null ? post.parent : undefined)
}

export default PostBox
