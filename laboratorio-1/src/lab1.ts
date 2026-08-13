/** Laboratorio 1: Aplicaciones Web Reactivas (CC5003).
 *
 * Integrantes:
 * - Francisco González Urriola.
 * - Sergio Romero Véliz.
 * - Jorge Cummins Holger.
 */

/**
 * =============================
 *  PREGUNTA 1
 * =============================
 */

/**
a) Significa que revisa los tipos del programa antes de ejecutarlo. Las ventajas sobre el tipado dinámico
son que permite detectar antes errores que ocurrirían en runtime.

b) El tipo any admite cualquier tipo sin quejarse, en cambio el tipo unknown permite cualquier tipo pero no
permite realizar operaciones.
En el ejemplo dado .toUpperCase() para el caso de data: any funciona y no habrán quejas del LSP/transpilador,
en cambio en el caso de data: unknown habrá un warning
 
c) Significa que si dos tipos tienen los mismos atributos entonces son el mismo tipo

*/

export interface A {
  foo: string;
}

export interface B {
  foo: string;
}

export const bar = (a: A) => a;
export const x: B = { foo: "1" };
export const y = bar(x); // no se queja porque A y B son equilvalentes~!

/**
 * =============================
 *  PREGUNTA 2
 * =============================
 */

export enum BakemonType {
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

export interface BakemonStats {
  hp: number;
  atk: number;
  def: number;
  sp_atk: number;
  sp_def: number;
  speed: number;
}

export interface BakemonMove {
  name: string;
  description: string;
  power?: number;
  pp: number;
  priority: number;
}

export interface Bakemon {
  id: number;
  name: string;
  type: BakemonType;
  secondary_type?: BakemonType;
  stats: BakemonStats;
  moves: BakemonMove[];
}

/**
 * =============================
 *  PREGUNTA 3
 * =============================
 */

/** Funcion filterBakemonByType
 *
 * Funcion que filtra una coleccion de "bakemons" segun su tipo primario o secundario. La funcion hace uso de
 * filter para crear un nuevo array con los "bakemons" que cumplen con la condicion.
 *
 * @param bakemonList: Coleccion de "bakemons" a filtrar.
 * @param type: Tipo de "bakemon" a filtrar.
 *
 */
export function filterBakemonByType(
  bakemonList: Bakemon[],
  type: BakemonType,
): Bakemon[] {
  return bakemonList.filter(
    (bakemon) => bakemon.type === type || bakemon.secondary_type === type,
  );
}

/**
 * =============================
 *  PREGUNTA 4
 * =============================
 */

export interface BakemonBst extends Bakemon {
  bst: number;
}

/** Funcion getBakemonBst
 *
 * Funcion que calcula el valor BST de un bakemon y genera un nuevo
 * objeto BakemonBst con este valor
 *
 * @param bakemon: Bakemon a calcular BST
 *
 */
export function getBakemonBst(bakemon: Bakemon): BakemonBst {
  const bst = Object.keys(bakemon.stats).reduce(
    (sum, key) => sum + bakemon.stats[key as keyof BakemonStats],
    0,
  );

  return {
    ...bakemon,
    bst: bst,
  };
}

/** Funcion getBakemonBstList
 *
 * Funcion que calcula el valor BST a una lista de bakemon generando
 * un arreglo de BakemonBst con este nuevo valor
 *
 * @param bakemons: Coleccion de "bakemons" a calcular BST
 *
 */
export function getBakemonBstList(bakemons: Bakemon[]): BakemonBst[] {
  return bakemons.map((bakemon) => {
    return getBakemonBst(bakemon);
  });
}

/**
 * =============================
 *  PREGUNTA 5
 * =============================
 */

export type BakemonByType = {
  [key in BakemonType]?: BakemonBst;
};

/** Funcion getBestBakemonByType
 * Funcion que al recibir una coleccion de bakemons calcula el
 * bakemon con mayor BST de cada tipo en un objeto BakemonByType
 *
 * @param bakemons: Coleccion de "bakemons" a calcular mejor bakemon por tipo
 *
 */
export function getBestBakemonByType(bakemons: Bakemon[]) {
  const bestBakemon: BakemonByType = {};
  const bakemonsBst = getBakemonBstList(bakemons);

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

export type BakemonMoveByType = {
  [key in BakemonType]?: BakemonMove;
};

/** Funcion getBestMoveByType
 * Funcion que al recibir un objeto BakemonByType encuentra el move con
 * mayor power para cada tipo retornando un objeto BakemonMoveByType
 *
 * @param bakemonByType: Coleccion de "bakemons" a calcular mejor move
 *
 */
export function getBestMoveByType(
  bakemonByType: BakemonByType,
): BakemonMoveByType {
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
