// P3: agregue aquí una estructura clickeable para entrar a la vista detallada
// del thread.

// P5: muestre la cantidad de likes y dislikes, con un botón para cada uno. El
// número debe cambiar sin recargar la página, así que conviene guardarlo en el
// estado del componente además de mandarlo al servidor.
//

import './postservices.css'
import type { Post } from '../types/posts'
import { Link } from 'react-router-dom'

interface PostBoxProps {
  post: Post
}

const PostBox = ({ post }: PostBoxProps) => {
  /**
   * Función auxiliar para reciclar código de renderización del thread.
   * @returns Un contenedor HTML con la información pedida del post
   */
  const showPost = (parentId?: number) => {
    // Si recibe un parentId, significa que es una respuesta a otro comentario
    const boxClass = parentId ? 'post-box reply-box' : 'post-box'
    return (
      <>
        <div className={boxClass}>
          <p className="post-title">
            { post.author === null ? 'Anónimo' : post.author }
          </p>
          <p className="post-text">
            { post.content }
          </p>
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
