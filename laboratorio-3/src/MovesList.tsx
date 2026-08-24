import type { BakemonMove } from "./model/Bakemon.ts";

function MovesList(props: BakemonMove[]) {
    const extractAttr = () => {
        return props.map((move) => {
           return { name: move.name, type: move.type, power: move.power, description: move.effect_entry }
        });
    };

    return (
        <>
            <ul>
                { extractAttr().map((attr) => {
                    return <li key={attr.name}>{attr.name}</li>;
                }) }
            </ul>
        </>
    );
}

export default MovesList;