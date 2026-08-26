import type { Bakemon } from "../types";

export const TEAM_SIZE = 6;

type Props = {
  team: Bakemon[];
  onRemove: (id: number) => void;
};

export function TeamBuilder({ team, onRemove }: Props) {
  const cells = Array.from({ length: TEAM_SIZE }, (_, index) => team[index] ?? null);

  return (
    <div>
      <h2>{`Mi equipo (${team.length}/${TEAM_SIZE})`}</h2>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {cells.map((bakemon, index) => (
          <div
            key={`team-cell-${index}`}
            style={{
              border: "1px solid #888",
              borderRadius: "8px",
              padding: "0.5rem",
              minWidth: "8rem",
              minHeight: "4rem",
            }}
          >
            {bakemon ? (
              <>
                <p>{bakemon.name}</p>
                <button onClick={() => onRemove(bakemon.id)}>
                  Quitar del equipo
                </button>
              </>
            ) : (
              <p>vacio</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
