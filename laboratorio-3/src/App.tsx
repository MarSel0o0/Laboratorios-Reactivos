import './App.css'
import bakemons from './data/bakemon.ts'
import BakemonDisplay from "./BakemonDisplay.tsx";
import type { Bakemon } from "./model/Bakemon.ts";
import {useState, type ChangeEvent} from "react";
import { firstLetterToUpperCase } from "./util/strings.ts";

function App() {
    const [selectedBakemon, setSelectedBake] = useState<number>(-1);

    const bakemonSelector = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedBake(Number(event.currentTarget.value));
    }

    const resolveBakemon = (bakemonID: number) => {
        const foundBakemon = bakemons.find((bakemon) => bakemon.id === bakemonID) as Bakemon | undefined;
        if (!foundBakemon) {
            return <p>Please, select a Bakemon from the list.</p>;
        }
        return (
            <BakemonDisplay id={foundBakemon.id} name={foundBakemon.name} height={foundBakemon.height} weight={foundBakemon.weight}
                            moves={foundBakemon.moves} abilities={foundBakemon.abilities} stats={foundBakemon.stats} types={foundBakemon.types} />
        );
    }

    return (
    <>
      <h1>Bakedex</h1>
      <div className="card">
          <label htmlFor={"bakemon-select"}> Choose a Bakemon: </label>
          <select id={"bakemon-select"} name={"bakemon-select"} size={3} onChange={bakemonSelector}>
              { bakemons.map((bake) => {
                  return (
                      <option value={bake.id}> {firstLetterToUpperCase(bake.name)} </option>
                  );
              }) }
          </select>
          <div className="bakemon-info">
              { resolveBakemon(selectedBakemon) }
          </div>
      </div>
    </>
    );
}

export default App
