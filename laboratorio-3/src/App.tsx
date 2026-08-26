import { useState } from "react";
import { BakemonList } from "./components/bakemon-list";
import { TeamBuilder, TEAM_SIZE } from "./components/team-builder";
import bakemonData from "./data/bakemon";
import type { Bakemon } from "./types";
import "./App.css";

const bakemons = bakemonData as Bakemon[];

function App() {
  const [team, setTeam] = useState<Bakemon[]>([]);

  const addToTeam = (bakemon: Bakemon) => {
    setTeam((currentTeam) => {
      const alreadyInTeam = currentTeam.some(
        (member) => member.id === bakemon.id,
      );
      if (alreadyInTeam || currentTeam.length >= TEAM_SIZE) return currentTeam;
      return [...currentTeam, bakemon];
    });
  };

  const removeFromTeam = (id: number) => {
    setTeam((currentTeam) => currentTeam.filter((member) => member.id !== id));
  };

  return (
    <body>
      <TeamBuilder team={team} onRemove={removeFromTeam} />
      <BakemonList
        bakemons={bakemons}
        team={team}
        onAddToTeam={addToTeam}
        onRemoveFromTeam={removeFromTeam}
      ></BakemonList>
    </body>
  );
}

export default App;
