/**
 * =============================
 *  PREGUNTA 1
 * =============================
 */

/**
 *
 * a) Que TypeScript sea de tipado estático significa que el compilador del lenguaje,
 *    checkea que la compatibilidad de tipos (ya sea para operaciones, asignaciones o llamadas funciones)
 *    sea la correcta en tiempo de compilación.
 *
 *    Esto proveee al lenguaje de una capa de seguridad frente a potenciales vulnerabilidades
 *    y errores en tiempo de ejecución.
 *
 * b) Los tipos `any` y `unknown` en escencia, tratan de representar lo mismo: cualquier tipo de dato.
 *    Sin embargo, la forma de utilizarlo es diferente. En este caso, `any` permite que cualquier tipo de operación
 *    sea realizada sobre la variable, mientras que `unknown` requiere que se haga un chequeo de tipo antes de realizar cualquier operación.
 *    Es por ello que el código de la izquierda si funcionaría si es que data fuese un string y arrojaría un error si no, pero el programa
 *    de la derecha ni siquiera compilaría, debido a que no se realizó una desambigüación de tipo antes de intentar realizar la operación.
 *
 *
 * c) Que TypeScript compare tipo de forma estructural significa que el lenguaje compara los tipos basandose en los atributos de los mismos,
 *    no en sus nombres.
 */


/**
 * =============================
 *  PREGUNTA 2
 * =============================
 */

const data = require('../bakemons.json') as Bakemon[]

/**
 * Para declarar los tipos literales correspondientes a todos los tipos
 * posibles para `type` y `secondary_type`, utilizo un array y coloco `as const` al final,
 * de manera de que TypeScript no infiere el tipo de `TYPES` como string[], sino como un arreglo
 * de literales.
 */
export const TYPES = [
    "NORMAL", "FIRE", "WATER", "GRASS", "ELECTRIC", "ICE",
    "FIGHTING", "POISON", "GROUND", "FLYING", "PSYCHIC",
    "BUG", "ROCK", "GHOST", "DARK", "DRAGON", "STEEL", "FAIRY"] as const;

/**
 * Aquí declaro el tipo Union de todos los tipos literales a partir del arreglo anterior.
 * Es sintaxis de TypeScript.
 * 1. typeof obtiene el tipo del valor que se posiciona a su derecha.
 * 2. [number] itera por cada valor dentro del arreglo, y al pasarlo por `typeof`, obtiene
 *    el tipo de cada elemento. Luego, el tipo `Type` es la union de los tipos de cada valor dentro
 *    del arreglo.
 * 3. Como el tipo de cada elemento es literal, `Type` resulta ser la union de esos tipos literales.
 */
export type Type = typeof TYPES[number];

/**
 * Se crea el tipo Stats para no tener que anotar todos estos atributos en la interface.
 * Es para que el código quede bonito.
 */
type Stats = {
  hp: number;
  atk: number;
  def: number;
  sp_atk: number;
  sp_def: number;
  speed: number;
}

/**
 * Exactamente análogo
 */
export type Move = {
  name: string;
  description: string;
  power?: number;
  pp: number;
  priority: number;
}

/**
 * La interfaz de Bakemon. Todos estuvimos de acuerdo con esta.
 */
export interface Bakemon {
  id: number;
  name: string;
  type: Type;
  secondaryType?: Type;
  stats: Stats;
  moves: Move[];
}

/**
 * =============================
 *  PREGUNTA 3
 *
 *  En esta pregunta creo que todos estuvimos igual.
 *  Usamos filter para iterar por cada elemento del arreglo de bakemons dado.
 *  Como el enunciado dice por tipo primario o secundario, se obedece la misma regla,
 *  buscando una coincidencia en el tipo primario, o en el tipo secundario.
 * =============================
 */

export function filterByType(bakemons: Bakemon[], type: Type): Bakemon[] {
  return bakemons.filter((bakemon: Bakemon): boolean => bakemon.type === type || bakemon.secondaryType === type)
}

/**
 * =============================
 *  PREGUNTA 4
 *
 *
 *  Se escogió el tipo (Bakemon & {bst: number})[] para el tipo de retorno, pues de esta manera no modificamos la interfaz original
 *  y solamente se altera para cuando quieremos calcular los BST de cada bakemon. Tendría sentido que se extendiera la interfaz original
 *  solamente si todos los bakemons pasaran por esta función.
 * =============================
 */

export function calculateBST(bakemon: Bakemon): number {
  return bakemon.stats.hp +
      bakemon.stats.atk +
      bakemon.stats.def +
      bakemon.stats.sp_atk +
      bakemon.stats.sp_def +
      bakemon.stats.speed;
}

/**
 * Se añáde una interfaz extendida para mayor legibilidad.
 */
export interface BakemonWithBST extends Bakemon {
  bst: number;
}

/**
 * Función para calcular addBST. Utilizo .map puesto que se requiere hacer una operación
 * a cada elemento del arreglo. Dicha operación reemplazar la instancia de tipo Bakemon
 * por una de tipo BakemonWithBST, en donde esta nueva instancia es exactamente igual a la visitada,
 * solamente que tiene un campo extra llamado `bst`. Se utiliza el operador spread (`...`) para esparcir
 * o copiar los campos de la instancia bakemon visitada.
 * @param bakemons la lista de bakemons iterada.
 */
export function addBST(bakemons: Bakemon[]): BakemonWithBST[] {
  return bakemons.map((bakemon: Bakemon): BakemonWithBST => {
    return { ...bakemon, bst: calculateBST(bakemon) };
  });
}

/**
 * =============================
 *  PREGUNTA 5
 *  Se elige el tipo `Partial<Record<Type, BakemonWithBST>>` porque:
 *  1. Record realiza el trabajo de crear el diccionario necesitado, donde cada llave corresponde
 *     a los valores que conforman el tipo `Type` y su valor es un valor de tipo BakemonWithBST.
 *
 *  2. Partial da paso a que exista la posibilidad de que no exista algún bakemon de algún tipo de naturaleza.
 *     De esta forma, el tipo que no tiene ningún bakemon en el arreglo revisado, no se incluye dentro del diccionario.
 * =============================
 */

export function findStrongestByType(bakemons: Bakemon[]): Partial<Record<Type, BakemonWithBST>> {

  /**
   * Se utiliza reduce, puesto que a partir de un arreglo, queremos generar una instancia única particular.
   * A partir del arreglo, generamos el diccionario, que es justamente lo que queremos.
   *
   * No se enreden con los tipos, es solamente para que todas las variables estén bien tipadas.
   *
   * Aquí acc es el acumulador. En esta variable se irá guardando el diccionario, agregando en cada iteración una nueva llave
   *
   * Aquí type es simplemente el tipo revisado en la iteración actual.
   *
   * Recuerden que los tipos se encuentran en TYPES, por eso se itera sobre este arreglo.
   */
  return TYPES.reduce((acc: Partial<Record<Type, BakemonWithBST>>, type: Type): Partial<Record<Type, BakemonWithBST>> => {

    // Aquí utilizamos la función anterior para filtrar por tipo. Donde el tipo por el cual filtrado, es por el actualmente revisado `type`.
    const bakemonsOfType: Bakemon[] = filterByType(bakemons, type);

    // Si no hay ningún bakemon del tipo revisado
    if (bakemonsOfType.length === 0) {
      /**
       * Simplemente, retornamos el acumulador (el diccionario) sin hacerle ningún cambio.
       * Como el retorno de la función es tipo Partial, podemos obviar los tipos que no tengan bakemons. Por eso este
       * retorno es correcto en este caso.
       */
      return acc;
    }

    /**
     * En otro caso (else), tenemos que encontrar el bakemon más fuerte para el tipo actual y agregarlo al diccionario.
     * Por esto se le agrega el bst a la lista de bakemons filtrada por tipo.
     */
    const bakemonsWithBST: BakemonWithBST[] = addBST(bakemonsOfType);
    /**
     * Y luego, se agrega la entrada al diccionario, con llave `type`, con valor, el bakemon con el BST más alto.
     *
     * Para encontrar el bakemon con el BST más alto, se quiere iterar por el arreglo filtrado de bakemons con BST, para
     * así obtener una sola instancia de bakemon, el más fuerte. Nuevamente, como desde un arreglo queremos obtener una
     * instancia particular, se necesita `reduce`.
     *
     * Aquí strongest es el bakemon más fuerte hasta el momento, y current es el bakemon revisado y posible candidato a
     * más fuerte.
     */
    acc[type] = bakemonsWithBST.reduce((strongest: BakemonWithBST, current: BakemonWithBST): BakemonWithBST => {
      return strongest.bst > current.bst ? strongest : current;
    }, bakemonsWithBST[0]); // `reduce` siempre debe tener un valor con el cual comenzar. En este caso comenzamos con el primer bakemon del arreglo.
    return acc;
  }, {} as Partial<Record<Type, BakemonWithBST>>) // Aquí, se declara el valor inicial para el `reduce` que se realiza para armar el diccionario.
                                                  // Se comienza con un diccionario vacío y se fuerza a que se infiera como el tipo de retorno declarado
                                                  // en la firma de la función.
}

/**
 * ============================
 *  PREGUNTA 6
 *
 *  Se elige el tipo `Partial<Record<Type, Move>>` por un argumento análogo a la pregunta anterior.
 * ============================
 */

export function findStrongestMoveByType(bakemons: Bakemon[]): Partial<Record<Type, Move>> {

  /**
   * Es examante el mismo argumento para usar `reduce`
   *
   * Aquí `acc` es nuevamente el diccionario acumulado en cada iteración y `type` es el tipo iterado.
   */
  return TYPES.reduce((acc: Partial<Record<Type, Move>>, type: Type): Partial<Record<Type, Move>> => {

    // Aquí se utiliza el bakemon más fuerte del tipo iterado, del cual se quiere extraer el movimiento más poderoso.
    const strongestBakemon: BakemonWithBST | undefined = findStrongestByType(bakemons)[type];

    /**
     *  Si no existe tal bakemon, al igual que en la función anterior, no agregamos la entrada correspondiente para el
     *  tipo `type` revisado actualmente.
     */
    if (!strongestBakemon) {
      return acc;
    }

    // Aquí se obtiene la lista de movimientos del bakemon que tienen el atributo `power`.
    const damageMoves: Move[] = strongestBakemon.moves.filter((move: Move): boolean => move.power !== undefined);

    /**
     * Si no hay ningún movimiento con el atributo `power`, no agregamos la entrada correspondiente para el
     * tipo `type` revisado actualmente.
     */
    if (damageMoves.length === 0) {
      return acc;
    }

    /**
     * Si existe, agregamos la entrada, igualito a como lo hicimos en la funcióna anterior.
     *
     * Lo único nuevo aquí, es el uso de `!` de un atributo que es opcional. Lo que realiza esto es que le decimos
     * al compilador que confié en nosotros y que no revise si ese atributo (o no se coloque en el caso) de que el atributo
     * sea `undefined`.
     */
    acc[type] = damageMoves.reduce((strongest: Move, current: Move): Move => {
      return strongest.power! > current.power! ? strongest : current;
    }, damageMoves[0]); // `reduce` comienza con el primer movimiento.
    return acc;


  }, {} as Partial<Record<Type, Move>>); // `reduce comienza con un diccionario vacío, igualito a la función anterior.
}
