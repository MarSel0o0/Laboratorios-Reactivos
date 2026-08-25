import { useState } from 'react'
import BakemonDisplay from "./components/BakemonDisplay";
import bakemonData from "./data/bakemon";
import type { Bakemon } from "./types";
import './App.css'

function App() {

  // estado que guarda el Bakemon seleccionado, o null si no hay ninguno
  const [selectedBakemon, setSelectedBakemon] = useState<Bakemon | null>(null);
  
  // estado del equipo, un arreglo de Bakemon, inicialmente vacío
  const [team, setTeam] = useState<Bakemon[]>([]);

  // helper: revisa si un bakemon ya está en el equipo
  const isInTeam = (bakemon: Bakemon) => {
    return team.some((b) => b.id === bakemon.id);
  };

  // función para agregar un Bakemon al equipo, recibe el bakemon a agregar
  const addToTeam = (bakemon: Bakemon) => {
    // solo agrega si el equipo tiene menos de 6 y el bakemon no está ya
    if (team.length < 6 && !isInTeam(bakemon)) {
      // creamos un nuevo arreglo con spread (...) en vez de mutar el original
      setTeam([...team, bakemon]);
    }
  };

  // función para quitar un Bakemon del equipo
  const removeFromTeam = (bakemon: Bakemon) => {
    // .filter() crea un nuevo arreglo sin el bakemon indicado (no muta el original)
    setTeam(team.filter((b) => b.id !== bakemon.id));
  };

  return (
    <div>
      <h1>Bakedex</h1>      

      <h2>Equipo</h2>
      <div>
        <div>{team[0] ? team[0].name : "Vacío"}</div>
        <div>{team[1] ? team[1].name : "Vacío"}</div>
        <div>{team[2] ? team[2].name : "Vacío"}</div>
        <div>{team[3] ? team[3].name : "Vacío"}</div>
        <div>{team[4] ? team[4].name : "Vacío"}</div>
        <div>{team[5] ? team[5].name : "Vacío"}</div>
      </div>

      {/* renderizado condicional: si hay un bakemon seleccionado, mostramos el detalle */}
      {selectedBakemon ? (
        <div>
          {/* botón para volver a la lista: pone el estado en null */}
          <button onClick={() => setSelectedBakemon(null)}>
            Volver a la lista
          </button>
          {/* mostramos el componente de detalle con el bakemon seleccionado */}
          <BakemonDisplay bakemon={selectedBakemon} />
        </div>
      ) : (
        // y si no hay bakemon seleccionado, mostramos la lista, para esto recorremos los bakemon con un map
        // asignandoles su id de key, y mostramos su id y nombre en la lista de botones
        <ul>
          {(bakemonData as Bakemon[]).map((b) => (
            <li key={b.id}>
              {/* al hacer click, guardamos ese bakemon en el estado */}
              <button onClick={() => setSelectedBakemon(b)}>
                #{b.id} {b.name}
              </button>

              {/* si el bakemon YA está en el equipo, mostramos botón de quitar */}
              {isInTeam(b) && (
                <button onClick={() => removeFromTeam(b)}>
                  Quitar del equipo
                </button>
              )}
              
              {/* si NO está en el equipo Y el equipo no está lleno, mostramos botón de agregar */}
              {!isInTeam(b) && team.length < 6 && (
                <button onClick={() => addToTeam(b)}>
                  Agregar al equipo
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

};


export default App
