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
import PostBox from '../components/PostBox';


const Thread = () => { 
    const { id } = useParams()
    const [thread, setThread] = useState<Post | null>(null);
    const [comments, setComments] = useState<Post[]>([]);
    useEffect(() => {
        if (!id) return;
        threadsService.getThread(id).then((data) => {
            setThread(data.thread);
            setComments(data.comments);
        });
    }, [id]);

     if (!thread) {
        return <div>Cargando...</div>
    }

    return (
        <div>
            <PostBox {...thread} />
            <ul>
                {comments.map((comment) => (
                    <PostBox key={comment.id} {...comment} />
                ))}
            </ul>
        </div>
    )

    
    
    }
 

export default Thread
