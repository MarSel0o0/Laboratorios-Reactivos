import bakemons from '../data/bakemon.ts';
import { firstLetterToUpperCase } from "../util/strings.ts";

interface TeamGridProps {
    team: number[];
}

function TeamGrid({ team }: TeamGridProps) {
    const cells = [];
    for (let i = 0; i < 6; i++) {
        const memberId = team[i];
        const member = memberId ? bakemons.find(b => b.id === memberId) : null;
        cells.push(
            <div key={i} className="team-cell">
                {member ? firstLetterToUpperCase(member.name) : "Vacío"}
            </div>
        );
    }

    return (
        <div className="team-builder">
            <h2>Mi Equipo</h2>
            <div className="team-grid">
                {cells}
            </div>
        </div>
    );
}

export default TeamGrid;
