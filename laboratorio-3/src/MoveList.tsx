
import moves from "./data/moves.ts";
import type { BakemonMove } from "./model/Bakemon.ts";

interface MoveListProps {
    moveIds: number[];
}

export default function MoveList({ moveIds }: MoveListProps) {
    return (

        <>
            <h2>Moves :</h2>

            {moveIds.map((moveId) => {
                // 1. Buscamos el movimiento correspondiente al ID
                const move = (moves as BakemonMove[]).find((m) => m.id === moveId);

                // 2. Si no existe en el archivo , no renderizamos nada para este ID
                if (!move) return null;

                // 3. Renderizamos la informacion con su key unica
                return (
                    <div key={move.id}>
                        <h3>{move.name}</h3>
                        <p>Type : {move.type}</p>
                        <p>Power : {move.power ? move.power : " ---"}</p>
                        <p>Description : {move.effect_entry}</p>
                    </div>
                );
            })}
        </>

    );
}