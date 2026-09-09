import { Request, Response, NextFunction } from 'express';

const forbiddenAuthors = ["Huevito rey", "Matías Toro", "Memes es mal ramo"];

export const validateThreadCreation = (req: Request, res: Response, next: NextFunction): void => {
    const { content, author } = req.body;

    if (!content || typeof content !== 'string' || content.length < 1 || content.length > 300) {
        res.status(400).json({ error: 'El contenido es requerido y debe tener entre 1 y 300 caracteres.' });
        return;
    }

    if (author && forbiddenAuthors.includes(author)) {
        res.status(400).json({ error: `${author} no puede ser autor de un thread.` });
        return;
    }

    next();
};

export const validateCommentCreation = (req: Request, res: Response, next: NextFunction): void => {
    const { content, author } = req.body;

    if (!content || typeof content !== 'string' || content.length < 1 || content.length > 300) {
        res.status(400).json({ error: 'El contenido es requerido y debe tener entre 1 y 300 caracteres.' });
        return;
    }

    if (author && forbiddenAuthors.includes(author)) {
        res.status(400).json({ error: `${author} no puede ser autor de un comentario.` });
        return;
    }

    next();
};
