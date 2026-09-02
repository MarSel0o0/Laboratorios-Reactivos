// P3: agregue aquí una estructura clickeable para entrar a la vista detallada
// del thread.

// P5: muestre la cantidad de likes y dislikes, con un botón para cada uno. El
// número debe cambiar sin recargar la página, así que conviene guardarlo en el
// estado del componente además de mandarlo al servidor.
//

interface Props {
  content: string;
  author: string | null;
  parent: number | null;
}

const PostBox = ({ content, author, parent }: Props) => {
  return (
    <div>
      <div>autor: {author ?? "Anoóimo"}</div>
      {parent && <div>En respuesta a: {parent}</div>}
      <div>content: {content}</div>
    </div>
  );
};

export default PostBox;
