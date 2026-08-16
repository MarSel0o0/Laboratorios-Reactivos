import mongoose from "mongoose";

// definimos una interfaz para los threads, describe la forma que tendran para el compilador
export interface IThread {
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// se crea el schema para mongoose, la definición formal de que campos tiene un thread y 
// como se validan, <IThread> conecta el schema con la interfaz tal que ts y mongoose 
// compartan la misma definición de tipos
const threadSchema = new mongoose.Schema<IThread>(
  {
    author: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

// se compila el schema en un "modelo", el objeto que se va a usar para la base de datos
// "Thread" es el nombre del modelo, con <IThread> se tipa el modelo para typescript
// con export default se deja el modelo disponible para importarlo en otros archivos
const Thread = mongoose.model<IThread>("Thread", threadSchema);
export default Thread;

