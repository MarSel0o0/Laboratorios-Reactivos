import type { BakemonMove } from "./model/Bakemon.ts";
import { firstLetterToUpperCase } from "./util/strings.ts";

interface MovesListProps {
    moves: BakemonMove[];
}

function MovesList({ moves }: MovesListProps) {
    const extractAttr = () => {
        return moves.map((move) => {
           return { name: move.name, type: move.type, power: move.power, description: move.effect_entry }
        });
    };

    return (
        <div className="moves-container">
            { extractAttr().map((move) => {
                return (
                    <ul key={move.name} className="move-card">
                        { Object.entries(move).map(([k, v]) => {
                            if (v === null) {
                                return <li key={k}><strong>{firstLetterToUpperCase(k)}:</strong> This move doesn't have power</li>
                            }
                            return (
                                <li key={k}><strong>{firstLetterToUpperCase(k)}:</strong> {firstLetterToUpperCase(String(v))}</li>
                            );
                        }) }
                    </ul>
                );
            }) }
        </div>
    );
}

export default MovesList;