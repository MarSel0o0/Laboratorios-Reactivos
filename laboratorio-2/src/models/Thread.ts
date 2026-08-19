import mongoose from "mongoose";

// P1: la interfaz describe la forma que tendrá cada documento de Thread
// en TypeScript. author y content son obligatorios (string). createdAt y
// updatedAt no los escribimos nosotros: mongoose los agrega solo gracias
// a la opción "timestamps" del schema, pero igual deben declararse aquí
// para que TypeScript sepa que existen y no marque error al usarlos.
export interface IThread {
    author: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

// P1: Defina aquí los campos author y content como obligatorios, y configure
// la creación automática de la fecha con timestamps o default: Date.now.
const threadSchema = new mongoose.Schema<IThread>({
    /* defina aqui sus campos */
    author: { type: String, required: true },
    content: { type: String, required: true },

},{ timestamps: true });

const Thread = mongoose.model<IThread>("Thread", threadSchema);
export default Thread;

