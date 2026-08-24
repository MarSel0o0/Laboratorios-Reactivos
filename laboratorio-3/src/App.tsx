import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import bakemons from './data/bakemon.ts'
import BakemonDisplay from "./BakemonDisplay.tsx";

function App() {
    debugger;
    const [count, setCount] = useState(0);
    return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        { bakemons.map((bakemon) => {
            return (
                <BakemonDisplay key={bakemon.id} id={bakemon.id} name={bakemon.name} abilities={bakemon.abilities} height={bakemon.height} weight={bakemon.weight} moves={bakemon.moves} stats={bakemon.stats} types={bakemon.types} />
            );
        }) }
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
    )
}

export default App
