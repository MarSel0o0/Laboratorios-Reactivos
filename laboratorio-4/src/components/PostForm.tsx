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
import { useState } from 'react';

interface PostFormProps {
  onSubmit: (data: { content: string, author?: string, parent?: number }) => void
  parent?: number
}

const PostForm = ({ onSubmit, parent }: PostFormProps) => {
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit =(event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({
            content,
            author: author || undefined,
            parent,
        });
        setContent('');
        setAuthor('');
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Contenido"
                />
            </div>
            <div>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Autor"
                />
            </div>
            <button type="submit">Publicar</button>
        </form>
    )
 }

export default PostForm
