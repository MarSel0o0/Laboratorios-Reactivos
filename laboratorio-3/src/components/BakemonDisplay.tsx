import type { Bakemon } from "../types";
import MovesList from "./MovesList";
import { useState } from "react";

interface BakemonDisplayProps {
  bakemon: Bakemon;
}

const BakemonDisplay = ({ bakemon }: BakemonDisplayProps) => {

    const [showMoves, setShowMoves] = useState(false);
    const totalStats = bakemon.stats.reduce((sum, stat) => sum + stat.base_value, 0);

    return (
    <div>
        <h2>
            #{bakemon.id} {bakemon.name}
        </h2>

        <h3>Tipos</h3>
        <ul>
            {bakemon.types.map((t) => (
            <li key={t.slot}>{t.type}</li>
            ))}
        </ul>

        <h3>Estadísticas base</h3>
        <ul>
            {bakemon.stats.map((stat) => (
            <li key={stat.name}>
                {stat.name}: {stat.base_value}
            </li>
            ))}
            <li><strong>Total: {totalStats}</strong></li>
        </ul>

        <h3>Habilidades</h3>
        <ul>
            {bakemon.abilities.map((ability) => (
            <li key={ability.slot}>
                {ability.name} {ability.is_hidden ? "(oculta)" : ""}
            </li>
            ))}
        </ul>

        <p>Height: {bakemon.height}</p>
        <p>Weight: {bakemon.weight}</p>

        <button onClick={() => setShowMoves(!showMoves)}>
        {/* el texto del botón cambia según el estado */}
        {showMoves ? "Ocultar movimientos" : "Expandir movimientos"}
        </button>
        
        {showMoves && <MovesList moveIDs={bakemon.moves} />}
    </div>
    );
};

export default BakemonDisplay;