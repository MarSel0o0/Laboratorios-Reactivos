import { useState } from "react";
import { BakemonDisplay } from "./bakemon-display";
import { TEAM_SIZE } from "./team-builder";
import type { Bakemon } from "../types";

type Props = {
  bakemons: Bakemon[];
  team: Bakemon[];
  onAddToTeam: (bakemon: Bakemon) => void;
  onRemoveFromTeam: (id: number) => void;
};

export function BakemonList({
  bakemons,
  team,
  onAddToTeam,
  onRemoveFromTeam,
}: Props) {
  const [selectedBakemon, setSelectedBakemon] = useState<null | Bakemon>(null);
  const teamIsFull = team.length >= TEAM_SIZE;

  return selectedBakemon ? (
    <>
      <p onClick={() => setSelectedBakemon(null)}>{"<- Atras"}</p>
      <BakemonDisplay bakemon={selectedBakemon} />
    </>
  ) : (
    <div>
      <h2>Bakemons</h2>
      <ul>
        {bakemons.map((bakemon) => {
          const isInTeam = team.some((member) => member.id === bakemon.id);

          return (
            <li
              key={`bakemon-${bakemon.id}`}
              onClick={() => setSelectedBakemon(bakemon)}
            >
              {bakemon.name}
              {isInTeam ? (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveFromTeam(bakemon.id);
                  }}
                >
                  Quitar del equipo
                </button>
              ) : (
                !teamIsFull && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onAddToTeam(bakemon);
                    }}
                  >
                    Agregar al equipo
                  </button>
                )
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
