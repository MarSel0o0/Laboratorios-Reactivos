import { Request, Response, NextFunction } from 'express';

// Middleware genérico para manejo de errores
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    console.error('Error no manejado:', err.message);

    if (err.name === 'CastError') {
        res.status(400).json({ error: 'Formato de ID inválido' });
        return;
    } else if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
        return;
    }

    // Para cualquier otro error que podría botar la página, devolvemos un 500
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
};
