import './App.css'
import bakemons from './data/bakemon.ts'
import BakemonDisplay from "./components/BakemonDisplay.tsx";
import TeamGrid from "./components/TeamGrid.tsx";
import type { Bakemon } from "./model/Bakemon.ts";
import {useState, type ChangeEvent} from "react";
import { firstLetterToUpperCase } from "./util/strings.ts";

function App() {
    const [selectedBakemon, setSelectedBake] = useState<number>(-1);
    const [team, setTeam] = useState<number[]>([]);

    const bakemonSelector = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedBake(Number(event.currentTarget.value));
    }

    const addToTeam = (id: number) => {
        if (team.length < 6 && !team.includes(id)) {
            setTeam([...team, id]);
        }
    }

    const removeFromTeam = (id: number) => {
        setTeam(team.filter(teamId => teamId !== id));
    }

    const resolveBakemon = (bakemonID: number) => {
        const foundBakemon = bakemons.find((bakemon) => bakemon.id === bakemonID) as Bakemon | undefined;
        if (!foundBakemon) {
            return <p>Please, select a Bakemon from the list.</p>;
        }

        const inTeam = team.includes(foundBakemon.id);
        const teamFull = team.length >= 6;

        return (
            <>
                <div className="team-actions" style={{ marginBottom: '1rem' }}>
                    { !inTeam && !teamFull && (
                        <button className="btn-add" onClick={() => addToTeam(foundBakemon.id)}>Add to the team</button>
                    ) }
                    { inTeam && (
                        <button className="btn-remove" onClick={() => removeFromTeam(foundBakemon.id)}>Remove from the team</button>
                    ) }
                </div>
                <BakemonDisplay id={foundBakemon.id} name={foundBakemon.name} height={foundBakemon.height} weight={foundBakemon.weight}
                                moves={foundBakemon.moves} abilities={foundBakemon.abilities} stats={foundBakemon.stats} types={foundBakemon.types} />
            </>
        );
    }

    const resetBake = () => {
        setSelectedBake(-1);
    }

    return (
    <>
      <h1>Bakedex</h1>

      <TeamGrid team={team} />

      <div className="card">
          <label htmlFor={"bakemon-select"}> Choose a Bakemon: </label>
          <select id={"bakemon-select"} name={"bakemon-select"} size={3} value={selectedBakemon} onChange={bakemonSelector}>
              <option value={-1} disabled style={{ display: 'none' }}></option>
              { bakemons.map((bake) => {
                  return (
                      <option key={bake.id} value={bake.id}> {firstLetterToUpperCase(bake.name)} </option>
                  );
              }) }
          </select>
          <button onClick={resetBake} style={{ margin: '10px' }}> Reset Selection </button>
          <div className="bakemon-info">
              { resolveBakemon(selectedBakemon) }
          </div>
      </div>
    </>
    );
}

export default App
