import BakemonDisplay from "./BakemonDisplay.tsx";
import './App.css'
import bakemons from './data/bakemon.ts';

function App() {

  return (
    <>
      <h1>Bakedex</h1>
      <div className="card">
          <BakemonDisplay id={bakemons[0].id} name={bakemons[0].name} height={bakemons[0].height}
                          weight={bakemons[0].weight} moves={bakemons[0].moves} abilities={bakemons[0].abilities} stats={bakemons[0].stats} types={bakemons[0].types} />
      </div>
    </>
  )
}

export default App
