export type Props = {
    comment: {
        id: number;
        thread: number | null;
        parent : number | null;
        createdAt: string;
        updatedAt: string;
        likes: number;
        dislikes: number;
        author : string | null;
        content: string;
    }

}