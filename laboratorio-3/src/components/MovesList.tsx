import type { BakemonMove } from "../types";
import movesData from "../data/moves";

// definimos los props: recibe un arreglo de IDs de movimientos (números)
interface Props {
  moveIDs: number[];
}

const MovesList = ({ moveIDs }: Props) => {

  // cruzamos los IDs del bakemon con los datos completos de moves.ts
  // .map() recorre cada id del arreglo moveIDs, ejecutando la función interior, que corresponde a un
  // .find() que busca en el arreglo de moves.ts el primer elemento donde move.id === id
  // se añade un cast as BakemonMove para asegurarle a ts que se va a encontrar 
  const moves = moveIDs.map((id) => movesData.find((move) => move.id === id) as BakemonMove);

  
  return (
    <div>
      <h3>Movimientos</h3>
      <ul>
        {moves.map((move) => (
          <li key={move.id}>
            <strong>{move.name}</strong>   <br/>
            {"Type: "}{move.type}   <br/>
            {"Power: "}{move.power !== null ? move.power : "N/A"}
            <p>{move.effect_entry}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default MovesList;
