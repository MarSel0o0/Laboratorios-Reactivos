import { useState } from "react";
import { MovesList } from "./moves-list";
import type { Bakemon } from "../types";

type Props = {
  bakemon: Bakemon;
};

export function BakemonDisplay({ bakemon }: Props) {
  const [showMoves, setShowMoves] = useState(true);
  const abilities = bakemon.abilities.sort((a, b) => a.slot - b.slot);
  const types = bakemon.types.sort((a, b) => a.slot - b.slot);
  const totalStats = bakemon.stats.reduce(
    (total, stat) => total + stat.base_value,
    0,
  );
  return (
    <div>
      <h1>{bakemon.name}</h1>
      <p key="id">{`ID: ${bakemon.id}`}</p>
      <p key="height">{`height: ${bakemon.height}`}</p>
      <p key="weight">{`weight: ${bakemon.weight}`}</p>
      <div key="abilities">
        <h2>Abilities</h2>
        {abilities.map((ability) => {
          return (
            <div key={`ability-${ability.slot}`}>
              <h3>{`slot ${ability.slot}: ${ability.name}`}</h3>
            </div>
          );
        })}
      </div>
      <div key="stats">
        <h2>Stats</h2>
        <ul>
          {bakemon.stats.map((stat, index) => (
            <li key={`stat-${index}`}>
              <p key="stat_name">{`${stat.name}: ${stat.base_value}`}</p>
            </li>
          ))}
          <h4>{`total: ${totalStats}`}</h4>
        </ul>
      </div>
      <div key="types">
        <h2>Types</h2>
        {types.map((type, index) => {
          return (
            <div key={`type-${index}`}>
              <h3>{`slot ${type.slot}: ${type.type}`}</h3>
            </div>
          );
        })}
      </div>
      <div>
        <div style={{ display: "flex" }}>
          <h3>Moves</h3>
          <p onClick={() => setShowMoves(!showMoves)}>
            {showMoves ? "ocultar" : "mostrar"}
          </p>
        </div>
        {showMoves && <MovesList moveIds={bakemon.moves}></MovesList>}
      </div>
    </div>
  );
}
