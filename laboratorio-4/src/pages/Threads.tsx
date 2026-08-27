// P2: página principal, con el listado de threads.
//
// Pide los threads al servidor con el módulo de servicios y los renderiza con
// el componente de P1. Recuerde que la llamada al servidor va dentro de un
// `useEffect` y su resultado en el estado del componente.
import { useEffect, useState } from 'react'
import type { Post } from '../types/posts'
import threadsService from '../services/threads'
import PostBox from '../components/PostBox'
import PostForm from '../components/PostForm'

const Threads = () => {
    const [threads, setThreads] = useState<Post[]>([]);

    useEffect(() => {
        threadsService.getAll().then((data) => {
            setThreads(data);
        })
    }, []);
    const handleCreate = (data: {content: string, author?: string}) => {
        threadsService.create(data).then((newThread) =>{
            setThreads([...threads, newThread]);

        });
    };
    return (
        <div>
            <PostForm onSubmit={handleCreate} />
            <ul>
                {threads.map((thread) => (
                    <PostBox key={thread.id} comment={thread} />
                ))}
            </ul>
        </div>
    )
}


export default Threads
