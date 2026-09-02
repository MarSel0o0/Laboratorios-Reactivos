// P4: formulario para publicar.
//
// Pide contenido y, de forma opcional, un autor. Quien lo usa decide qué hacer
// al enviarlo: en la página principal crea un thread, y en la vista detallada
// crea un comentario. Conviene entonces recibir esa acción por props en vez de
// llamar al servidor desde acá.
//
// El mismo componente sirve para el formulario desplegable de respuesta, que
// además manda el id del comentario al que responde.
//
import { type SubmitEvent } from 'react'

interface PostFormProps {
  onSubmit: (data: { content: string, author?: string, parent?: number }) => void
  parentId?: number
}

const PostForm = ({ onSubmit, parentId }: PostFormProps) => {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event?.currentTarget)
    const content = formData.get('content') as string
    const author = formData.get('author') as string

    event.currentTarget.reset()
    onSubmit({
      content,
      author: author ? author : undefined,
      parent: parentId,
    })
  }
  return (
    <form onSubmit={handleSubmit} className="post-form">
      <input name="author" placeholder="Autor (opcional)" />
      <textarea name="content" placeholder="Escribe aquí..." required />
      <button type="submit">Enviar</button>
    </form>
  )
}

export default PostForm
