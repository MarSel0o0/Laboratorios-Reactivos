import type { BakemonMove } from "../types";
import movesData from "../data/moves";

const moves = movesData as BakemonMove[];

type Props = {
  moveIds: number[];
};

export function MovesList({ moveIds }: Props) {
  const resolvedMoves = moveIds
    .map((id) => moves.find((move) => move.id === id))
    .filter((move) => move !== undefined);

  return (
    <div>
      <h2>Moves</h2>
      {resolvedMoves.map((move) => {
        return (
          <div key={`move-${move.id}`}>
            <h3>{move.name}</h3>
            <p key="type">{`type: ${move.type}`}</p>
            <p key="power">
              {`power: ${move.power === null ? "sin potencia" : move.power}`}
            </p>
            <p key="effect">{move.effect_entry}</p>
          </div>
        );
      })}
    </div>
  );
}
