import type {Bakemon, BakemonAbility, BakemonMove, BakemonStat, BakemonType} from "../model/Bakemon.ts";
import { totalStats } from "../model/Bakemon.ts";
import { firstLetterToUpperCase } from "../util/strings.ts";
import moves from "../data/moves.ts";
import MovesList from "./MovesList.tsx";
import {useState} from "react";


function BakemonDisplay(props: Bakemon) {

    const [showMoves, setShowMoves] = useState<boolean>(false);

    const matchMoves = (ids: number[]): BakemonMove[] => {
        return ids.map((id: number): BakemonMove => {
           return moves.find((move) => move.id === id)!;
        });
    }

    const listObject = <T extends object>(key: string, attrs: T[]) => {
        if (!attrs || attrs.length === 0) {
            return (<></>);
        }
        return (
            <li key={key}> { firstLetterToUpperCase(key) } <ul> { attrs.map((item, index) => {
                return (
                  <li key={index}>
                      { typeof item === 'object' && item !== null
                          ? Object.entries(item).map(([k,v]) => `${firstLetterToUpperCase(k)} ${firstLetterToUpperCase(String(v))}`).join(' - ')
                          : String(item)
                      }
                  </li>
                );
            }) } </ul> </li>
        )
    }

    const clickShowMoves = ()=> {
        setShowMoves(!showMoves);
    }

    const iterateBakemon = (obj: Bakemon) => {
        return Object.entries(obj).map(([key, value]: [string, object | number | string]) => {
            switch (key) {
                case "types":
                    return listObject(key, value as BakemonType[]);
                case "abilities": {
                    return listObject(key, value as BakemonAbility[]);
                }
                case "stats": {
                    return (
                        <>
                            { listObject(key, value as BakemonStat[]) }
                            <li key={"total-stats"}> { "BST: " } { totalStats(obj) } </li>
                        </>
                    );
                }
                case "moves": {
                    const matched = matchMoves(value as number[]);
                    return (
                        <>
                            <button  onClick={clickShowMoves}>
                                {showMoves ? 'Hide Movements' : 'Show Movements'}
                            </button>
                            { showMoves && (<li key="moves">
                                Moves
                                <MovesList moves={matched}/>
                            </li>) }
                        </>

                    );
                }
                case "id":
                    return (<></>);
                default:
                    return (
                        <li key={key}> { firstLetterToUpperCase(key) + ": " } { firstLetterToUpperCase(String(value)) } </li>
                    );
            }
        })
    }

    return (
      <>
          <ul>
              { iterateBakemon(props) }
          </ul>
      </>
    );
}

export default BakemonDisplay;