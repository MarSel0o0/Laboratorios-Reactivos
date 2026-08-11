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

const TYPES = [
    "NORMAL", "FIRE", "WATER", "GRASS", "ELECTRIC", "ICE",
    "FIGHTING", "POISON", "GROUND", "FLYING", "PSYCHIC",
    "BUG", "ROCK", "GHOST", "DARK", "DRAGON", "STEEL", "FAIRY"] as const;

type Type = typeof TYPES[number];

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
  power: number | null; // la clave siempre está presente en bakemons.JSON, pero puede ser null 
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

interface BakemonWithBST extends Bakemon {
  bst: number;
}

function calculateBST(bakemon: Bakemon): number {
  const { hp, atk, def, sp_atk, sp_def, speed } = bakemon.stats;
  return hp + atk + def + sp_atk + sp_def + speed;
}

function addBST(bakemons: Bakemon[]): BakemonWithBST[] {
  return bakemons.map(
    (bakemon: Bakemon): BakemonWithBST => ({
      ...bakemon, bst: calculateBST(bakemon),
    })
  );
}

/**
 * =============================
 *  PREGUNTA 5
 * =============================
 */

/**
 * Igual que filterByType, pero tipada para BakemonWithBST, de modo que el
 * campo `bst` no se pierda al filtrar, así no se calcula el BST de nuevo, si no que empezamos con la lista de
 * BakemonWithBST ya calculada.
 */
function filterByTypeBST(bakemons: BakemonWithBST[], type: Type): BakemonWithBST[] {
  return bakemons.filter((bakemon) => bakemon.type === type || bakemon.secondary_type === type)
}

function findStrongestByType(bakemons: BakemonWithBST[]): Partial<Record<Type, BakemonWithBST>> {
  return TYPES.reduce((acc: Partial<Record<Type, BakemonWithBST>>, type: Type): Partial<Record<Type, BakemonWithBST>> => {
    const candidates: BakemonWithBST[] = filterByTypeBST(bakemons, type);

    if (candidates.length === 0) return acc;

    acc[type] = candidates.reduce(
      (strongest: BakemonWithBST, current: BakemonWithBST): BakemonWithBST =>
        current.bst > strongest.bst ? current : strongest,
      candidates[0]
    );

    return acc;
  }, {} as Partial<Record<Type, BakemonWithBST>>);
}


/**
 * =============================
 *  PREGUNTA 6
 * =============================
 */

