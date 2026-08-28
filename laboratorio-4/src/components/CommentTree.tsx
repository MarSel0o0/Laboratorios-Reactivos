import { useState } from 'react'
import PostBox from './PostBox.tsx'
import PostForm from './PostForm.tsx'
import type { Post } from '../types/posts.ts'

const CommentTree = ({ comment, allComments, onReply }: { comment: Post, allComments: Post[], onReply: (data: { content: string, author?: string, parent?: number }) => void }) => {
  const [isReplying, setIsReplying] = useState(false)
  // Buscamos si hay comentarios que respondan a este comentario en particular
  const replies = allComments.filter(c => c.parent === comment.id)

  return (
    <div className="comment-node">
      <PostBox post={comment} />
      <button
        className="reply-button"
        onClick={() => setIsReplying(!isReplying)}
        style={{ marginBottom: '10px', fontSize: '0.85em', cursor: 'pointer' }}
      >
        {isReplying ? 'Cancelar respuesta' : 'Responder a este comentario'}
      </button>

      {/* Formulario desplegable */}
      {isReplying && (
        <div className="reply-form-container" style={{ marginBottom: '15px' }}>
          <PostForm
            parentId={comment.id}
            onSubmit={(data) => {
              onReply(data)
              setIsReplying(false) // Lo cerramos automáticamente al enviar
            }}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="comment-replies" style={{ marginLeft: '40px', borderLeft: '2px solid #eaeaea', paddingLeft: '15px' }}>
          {replies.map(reply => (
            <CommentTree key={reply.id} comment={reply} allComments={allComments} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentTree
