// P1: componente que renderiza un thread o un comentario.
//
// Recibe por props el contenido y el autor. Si el autor viene vacío, muestra
// "Anónimo". Si el comentario responde a otro, recibe además el id del
// respondido y lo muestra; si no responde a nadie, no muestra nada.

//
import { Link } from 'react-router-dom';
import type { Props } from '../types/props';
import { useState } from 'react';
import  PostForm  from './PostForm'
// hago una destructuración solo del primer nivel de la firma, y luego solo utilizo lo que necesito
// dentro del cuerpo de la función
interface PostBoxProps extends Props {
    onReply?: (data: { content: string, author?: string, parent?: number}) => void
}

const PostBox = ({comment, onReply}: PostBoxProps) => {
    const {content, author, parent, thread, id} = comment;
    const [showReplyForm, setShowReplyForm] = useState(false);


    const postContent = (
        <li>{content}, {author ?? "Anónimo"}, {parent && `Respuesta a ${parent}`}
        {onReply &&(
            <div>
                <button onClick={() => setShowReplyForm(!showReplyForm)}>
                    Responder
                </button>
                {showReplyForm && <PostForm onSubmit={onReply} parent={id}/>}
            </div>
        )}</li>
    );
    return thread === null ? (
        <Link to ={`/thread/${id}`}>{postContent}</Link>
    ) : (
        postContent
    );
}


export default PostBox;

