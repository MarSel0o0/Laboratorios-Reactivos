import type { Bakemon, BakemonAbility, BakemonStat, BakemonType } from "./model/Bakemon.ts";
import { totalStats } from "./model/Bakemon.ts";


function BakemonDisplay(props: Bakemon) {

    const listObject = <T extends object>(key: string, attrs: T[]) => {
        if (!attrs || attrs.length === 0) {
            return (<></>);
        }
        return (
            <li key={key}> { key } <ul> { attrs.map((item, index) => {
                return (
                  <li key={index}>
                      { typeof item === 'object' && item !== null
                          ? Object.entries(item).map(([k, v]) => `${k}: ${String(v)}`).join(', ')
                          : String(item)
                      }
                  </li>
                );
            }) } </ul> </li>
        )
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
                            <li key={"total-stats"}> { "Total: " } { totalStats(obj) } </li>
                        </>
                    );
                }
                case "moves":
                case "id":
                    return (<></>);
                default:
                    return (
                        <li key={key}> { key + ": " } { value as string | number } </li>
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