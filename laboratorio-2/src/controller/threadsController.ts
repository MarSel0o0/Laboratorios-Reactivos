import { Request, Response } from "express";
import Thread from "../models/Thread";


/** implementación de los controladores para las rutas de hilos */

export const saveNewThread = async (req: Request, res: Response) => {
    const { author, content } = req.body;
    if (author && content) {
        const thread = await Thread.create({ author, content });
        return res.status(201).json(thread);
    }
    return res.status(401).json({ error: "Not authorized" });
}

export const getAllThreads = async (req: Request, res: Response) => {
    const threads = await Thread.find({});
    return res.json(threads);
};

export const getHome = async (req: Request, res: Response) => {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <link rel="stylesheet" type="text/css" href="/main.css" />
                <script type="text/javascript" src="/spa.js" defer></script>
                <meta charset="UTF-8">
                <title>Threads</title>
            </head>
            <body>
                <div class="container">
                    <h1>Threads -- SPA</h1>
                    <div id="threads"></div>
                    <form id="threads_form">
                        <input class="input-container" type="text" name="author" placeholder="Author"/><br>
                        <input class="input-container" type="text" name="content" placeholder="Content"/><br>
                        <input class="input-container" type="submit" value="Save" />
                    </form>
                </div>
            </body>
        </html>
    `;
    res.send(html);
};