// P3: vista detallada de un thread, con el thread y su listado de comentarios.
//
// El id del thread viene de la ruta. Con React Router se obtiene con
// `useParams`; si resuelve la navegación de otra forma, tendrá que recibirlo
// por props.
//
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Post } from '../types/posts'
import threadsService from '../services/threads'
import PostBox from '../components/PostBox'
import PostForm from '../components/PostForm'

const Thread = () => {
    const { id } = useParams<{ id: string }>();
    const [thread, setThread] = useState<Post | null>(null);
    const [comments, setComments] = useState<Post[]>([]);
    useEffect(() => {
        if (!id) return;
        threadsService.getThread(id).then((data) => {
            setThread(data.thread);
            setComments(data.comments);
        });
    }, [id]);

    const handleCreateComment = (data: {content: string, author?: string, parent?: number}) => {
        if (!id) return;
        threadsService.createComment(data, +id ).then((newComment) =>{
            setComments([...comments, newComment])
        })
    };

    if (!thread) {
        return <div>Cargando...</div>
    }

    return (
        <div>
            <PostForm onSubmit ={handleCreateComment}/>
            <PostBox comment={thread} />
            <ul>
                {comments.map((comment) => (
                    <PostBox key={comment.id} comment={comment} onReply ={handleCreateComment}/>
                ))}
            </ul>
        </div>
    )

    
    
    }

export default Thread
