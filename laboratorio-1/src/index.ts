/**
 * =============================
 *  PREGUNTA 1
 * =============================
 */

/**
 * a) La diferencia entre estos tipados corresponde al momento en el que se verifican los tipos de las variables.
 *  
 *    Los lenguajes de tipado dinámico chequean en tiempo de ejecución, tal que el interprete asigna a las variables
 *    un tipo basado en su valor al momento de ejecutarse.
 *
 *    Por otro lado, los lenguajes de tipado estático chequean los tipos en tiempo de compilación, así, cada variable
 *    se debe declarar de un tipo, que no se puede cambiar.
 * 
 *    El tipado estático permite la detección temprana (en tiempo de compilación) de errores y al conocer los tipos
 *    de antemano, se obtiene mejor rendimiento de ejecución del programa.
 * 
 * b) La diferencia es que `any` desactiva el chequeo de tipos en compilación, mientras que `unknown` no lo hace.
 * 
 *    Al usar `any` se admite cualquier operación, sin restricciones, por lo que el ejemplo de la izquierda 
 *    compila sin errores, a pesar de fallar en tiempo de ejecución (por intentar usar `toUpperCase()` con números).
 *    Mientras que el ejemplo de la derecha no va a compilar, ya que al usar unknown se requeriria una verificación
 *    previa de `type of data === 'string'` para utilizar `toUpperCase()`.
 * 
 * c) Significa que compara los tipos por su forma y no por como fueron declarados, tal que dos objetos con las mismas
 *    propiedades serán compatibles, sin importar el nombre de sus tipos.
 * 
 *    Por ejemplo, asumimos interfaz Bebida (con forma correspondiente) y función tomar existentes, tal que:
 * 
 *    class Bilz{
 *      nombre: "Bilz";
 *      tamaño: 550;
 *      color: "rojo";
 *    }
 *      
 *    class Pap{
 *      nombre: "Pap";
 *      tamaño: 900;
 *      color: "amarillo"
 *    }
 *    
 *    function tomar(bebida: Bebida){ . . . }
 *    
 *    tomar(new Pap());
 *    tomar(new Bilz());
 *    // Ambos compilan !!
 * 
 *    "If it walks like a duck and it quacks like a duck, then it must be a duck." 
 */

/**
 * =============================
 *  PREGUNTA 2
 * =============================
 */

const data = require('../bakemons.json') as Bakemon[]

enum Type {
  Normal = "NORMAL",
  Fire = "FIRE",
  Water = "WATER",
  Electric = "ELECTRIC",
  Grass = "GRASS",
  Ice = "ICE",
  Fighting = "FIGHTING",
  Poison = "POISON",
  Ground = "GROUND",
  Flying = "FLYING",
  Psychic = "PSYCHIC",
  Bug = "BUG",
  Rock = "ROCK",
  Ghost = "GHOST",
  Dragon = "DRAGON",
  Dark = "DARK",
  Steel = "STEEL",
  Fairy = "FAIRY",
}

interface Stats {
  hp: number;
  atk: number;
  def: number;
  sp_atk: number;
  sp_def: number;
  speed: number;
}

interface Move {
  name: string;
  description: string;
  power: number | null; // si usamos null
  // power?: number; si usamos undefined !!
  pp: number;
  priority: number;
}

interface Bakemon {
  id: number;
  name: string;
  type: Type;
  secondary_type?: Type; // no siempre esta 
  stats: Stats;
  moves: Move[];
}

/**
 * =============================
 *  PREGUNTA 3
 * =============================
 */

function filterByType(bakemons: Bakemon[], type: Type): Bakemon[] {
  return bakemons.filter((bakemon) => bakemon.type === type || bakemon.secondary_type === type)
}

/**
 * =============================
 *  PREGUNTA 4
 * =============================
 */

interface BakemonBST extends Bakemon {
  bst: number;
}

function calculateBST(bakemon: Bakemon): BakemonBST {
  const bst = Object.keys(bakemon.stats).reduce(
    (sum, key) => sum + bakemon.stats[key as keyof Stats],
    0,
  );

  return {
    ...bakemon,
    bst: bst,
  };
}

function addBST(bakemons: Bakemon[]): BakemonBST[] {
  return bakemons.map((bakemon) => {
    return calculateBST(bakemon);
  });
}

/**
 * =============================
 *  PREGUNTA 5
 * =============================
 */

type BakemonByType = {
  [key in Type]?: BakemonBST;
};

function getBestBakemonByType(bakemons: Bakemon[]) {
  const bestBakemon: BakemonByType = {};
  const bakemonsBst = addBST(bakemons);

  bakemonsBst.forEach((bakemon) => {
    if (bakemon.bst > (bestBakemon[bakemon.type]?.bst ?? 0))
      bestBakemon[bakemon.type] = bakemon;
    if (
      bakemon.secondary_type &&
      bakemon.bst > (bestBakemon[bakemon.secondary_type]?.bst ?? 0)
    )
      bestBakemon[bakemon.secondary_type] = bakemon;
  });

  return bestBakemon;
}

/**
 * =============================
 *  PREGUNTA 6
 * =============================
 */

type BakemonMoveByType = {
  [key in Type]?: Move;
};

function getBestMoveByType(bakemonByType: BakemonByType): BakemonMoveByType {
  const bestBakemonMoves: BakemonMoveByType = {};
  Object.keys(bakemonByType).forEach((type) => {
    const bakemon = bakemonByType[type as keyof BakemonByType];
    if (bakemon) {
      bakemon.moves.forEach((move) => {
        if ((move.power ?? 0) > (bestBakemonMoves[bakemon.type]?.power ?? 0))
          bestBakemonMoves[bakemon.type] = move;
      });
    }
  });

  return bestBakemonMoves;
}

