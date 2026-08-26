import { useState } from "react";
import "./App.css";
import {
  bakemons,
  getBaseStatTotal,
  getMovesForBakemon,
  type Bakemon,
  type BakemonMove,
} from "./data/lab3";

function formatName(name: string): string {
  return name.replaceAll("-", " ");
}

function BakemonDisplay({ bakemon }: { bakemon: Bakemon }) {
  const [movesExpanded, setMovesExpanded] = useState(false);
  const resolvedMoves = getMovesForBakemon(bakemon);

  return (
    <section className="detail-panel">
      <div className="detail-heading">
        <div>
          <p className="eyebrow">Bakemon seleccionado</p>
          <h2>{formatName(bakemon.name)}</h2>
        </div>
        <span className="dex-number">
          #{String(bakemon.id).padStart(3, "0")}
        </span>
      </div>
      <div className="type-list" aria-label="Tipos">
        {bakemon.types.map((type) => (
          <span className={`type-chip type-${type.type}`} key={type.slot}>
            {type.type}
          </span>
        ))}
      </div>
      <div className="facts-grid">
        <div>
          <span>Altura</span>
          <strong>{(bakemon.height / 10).toFixed(1)} m</strong>
        </div>
        <div>
          <span>Peso</span>
          <strong>{(bakemon.weight / 10).toFixed(1)} kg</strong>
        </div>
        <div>
          <span>Estadísticas base</span>
          <strong>{getBaseStatTotal(bakemon)}</strong>
        </div>
      </div>
      <div className="detail-columns">
        <div>
          <h3>Habilidades</h3>
          <ul className="plain-list">
            {bakemon.abilities.map((ability) => (
              <li key={ability.slot}>
                {formatName(ability.name)}
                {ability.is_hidden ? <small>Oculta</small> : null}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Estadísticas</h3>
          <ul className="stats-list">
            {bakemon.stats.map((stat) => (
              <li key={stat.name}>
                <span>{formatName(stat.name)}</span>
                <strong>{stat.base_value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="moves-heading">
        <div>
          <h3>Movimientos</h3>
          <span>{resolvedMoves.length} disponibles</span>
        </div>
        <button
          type="button"
          onClick={() => setMovesExpanded((expanded) => !expanded)}
        >
          {movesExpanded ? "Ocultar movimientos" : "Expandir movimientos"}
        </button>
      </div>
      {movesExpanded ? <MovesList moves={resolvedMoves} /> : null}
    </section>
  );
}

function MovesList({ moves }: { moves: BakemonMove[] }) {
  return (
    <div className="moves-list">
      {moves.map((move) => (
        <article className="move-row" key={move.id}>
          <div>
            <strong>{formatName(move.name)}</strong>
            <span>
              {move.type} ·{" "}
              {move.power === null ? "Sin potencia" : `Potencia ${move.power}`}
            </span>
          </div>
          <p>{move.effect_entry}</p>
        </article>
      ))}
    </div>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [team, setTeam] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const selected = bakemons.find((bakemon) => bakemon.id === selectedId);
  const filteredBakemons = bakemons.filter((bakemon) =>
    bakemon.name.includes(query.toLowerCase()),
  );

  function toggleTeam(bakemon: Bakemon) {
    setTeam((currentTeam) =>
      currentTeam.includes(bakemon.id)
        ? currentTeam.filter((id) => id !== bakemon.id)
        : currentTeam.length < 6
          ? [...currentTeam, bakemon.id]
          : currentTeam,
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">CC5003 · Laboratorio 3</p>
          <h1>Bakedex</h1>
        </div>
        <div className="team-count">
          Equipo <strong>{team.length}/6</strong>
        </div>
      </header>
      <section className="workspace">
        <aside className="roster-panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Catálogo</p>
              <h2>Bakemons</h2>
            </div>
            <span>{filteredBakemons.length}</span>
          </div>
          <label className="search-label" htmlFor="search">
            Buscar por nombre
          </label>
          <input
            id="search"
            type="search"
            placeholder="Ej. bulbasaur"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="roster-list">
            {filteredBakemons.map((bakemon) => {
              const inTeam = team.includes(bakemon.id);
              return (
                <div
                  className={`roster-item ${selectedId === bakemon.id ? "is-selected" : ""}`}
                  key={bakemon.id}
                >
                  <button
                    type="button"
                    className="roster-select"
                    onClick={() => setSelectedId(bakemon.id)}
                  >
                    <span className="mini-number">
                      {String(bakemon.id).padStart(3, "0")}
                    </span>
                    <strong>{formatName(bakemon.name)}</strong>
                  </button>
                  <button
                    type="button"
                    className="team-action"
                    onClick={() => toggleTeam(bakemon)}
                    disabled={!inTeam && team.length === 6}
                  >
                    {inTeam ? "Quitar" : "Agregar"}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
        <div className="content-column">
          {selected ? (
            <>
              <button
                className="back-button"
                type="button"
                onClick={() => setSelectedId(null)}
              >
                ← Volver al catálogo
              </button>
              <BakemonDisplay bakemon={selected} />
            </>
          ) : (
            <div className="empty-state">
              <span className="empty-mark">B</span>
              <p className="eyebrow">Bakedex</p>
              <h2>Elige un Bakemon</h2>
              <p>
                Selecciona una entrada del catálogo para consultar sus datos y
                movimientos.
              </p>
            </div>
          )}
          <section className="team-panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">Composición</p>
                <h2>Tu equipo</h2>
              </div>
              <span>{team.length} / 6</span>
            </div>
            <div className="team-grid">
              {Array.from({ length: 6 }, (_, index) => {
                const member = bakemons.find(
                  (bakemon) => bakemon.id === team[index],
                );
                return (
                  <div className="team-slot" key={index}>
                    {member ? (
                      <>
                        <span>#{String(member.id).padStart(3, "0")}</span>
                        <strong>{formatName(member.name)}</strong>
                        <button
                          type="button"
                          aria-label={`Quitar ${member.name}`}
                          onClick={() => toggleTeam(member)}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span className="slot-empty">Espacio libre</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;
