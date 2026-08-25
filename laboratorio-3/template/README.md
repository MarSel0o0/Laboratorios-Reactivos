# Bakedex - Laboratorio 3

Aplicacion React + TypeScript para consultar Bakemons, revisar sus movimientos y construir un equipo de hasta seis integrantes.

## Ejecutar

```bash
npm install
npm run dev
```

Tambien se puede comprobar la compilacion con `npm run build` y el estilo con `npm run lint`.

## Tipos y datos

Los datos viven en `src/data/bakemon.ts` y `src/data/moves.ts`. En `src/data/lab3.ts` se definieron los tipos `Bakemon`, `BakemonMove`, `Ability`, `Stat`, `Type` y `StatChange`.

- `Bakemon.moves` contiene ids numericos, porque asi vienen en `bakemon.ts`.
- `getMovesForBakemon` cruza cada id con `moves.ts` y descarta ids sin coincidencia.
- `getBaseStatTotal` usa `reduce` para sumar los valores base de las seis estadisticas.

Codigo principal de tipos y funciones:

```ts
export interface Bakemon {
	id: number
	name: string
	abilities: Ability[]
	height: number
	weight: number
	moves: number[]
	stats: Stat[]
	types: Type[]
}

export function getBaseStatTotal(bakemon: Bakemon): number {
	return bakemon.stats.reduce((total, stat) => total + stat.base_value, 0)
}

export function getMovesForBakemon(bakemon: Bakemon): BakemonMove[] {
	return bakemon.moves
		.map((moveId) => moves.find((move) => move.id === moveId))
		.filter((move): move is BakemonMove => move !== undefined)
}
```

## P1 - Conceptos de React

### a) Componentes

Un componente es una funcion que recibe datos y devuelve una parte de la interfaz mediante JSX. React usa esa funcion dentro de su arbol de componentes y vuelve a ejecutarla cuando debe renderizar cambios.

Una funcion comun de TypeScript puede realizar cualquier calculo y devolver cualquier valor, pero no necesariamente representa interfaz ni participa en el ciclo de renderizado de React. Por ejemplo, `formatName` es una funcion auxiliar comun, mientras que `BakemonDisplay` es un componente porque devuelve JSX.

Codigo del componente y de la funcion auxiliar mencionados:

```tsx
function formatName(name: string): string {
	return name.replaceAll('-', ' ')
}

function BakemonDisplay({ bakemon }: { bakemon: Bakemon }) {
	return <h2>{formatName(bakemon.name)}</h2>
}
```

### b) Props y state

- **Props:** son datos recibidos desde el componente padre. El componente hijo puede leerlos, pero no debe modificarlos directamente. Si el padre entrega nuevas props, React vuelve a renderizar el hijo.
- **State:** es informacion privada y mutable de un componente. Se actualiza con la funcion entregada por `useState`; al hacerlo, React programa un nuevo renderizado.

En esta solucion, `bakemon` y `moves` son props. En cambio, `selectedId`, `team`, `query` y `movesExpanded` son estados.

Ejemplo de props y estado usados en la aplicacion:

```tsx
function MovesList({ moves }: { moves: BakemonMove[] }) {
	return <div>{moves.map((move) => <p key={move.id}>{move.name}</p>)}</div>
}

const [movesExpanded, setMovesExpanded] = useState(false)
```

### c) JSX frente a HTML

JSX es una sintaxis de JavaScript/TypeScript que se transforma en llamadas a React. No es HTML plano: usa nombres de propiedades de JavaScript y permite insertar expresiones.

```tsx
<div className="card">{bakemon.name}</div>
```

`className` representa la propiedad `class` del elemento React. Las llaves permiten evaluar expresiones TypeScript, como leer una propiedad, hacer una conversion o mostrar contenido condicional:

```tsx
{movesExpanded ? <MovesList moves={moves} /> : null}
```

## P2 - `BakemonDisplay`

`BakemonDisplay` recibe `{ bakemon }` como prop y muestra:

1. Nombre y numero de la entrada.
2. Todos los tipos con `map`.
3. Altura, peso y total de estadisticas base.
4. Habilidades, indicando las ocultas.
5. Cada estadistica base.

Los recorridos usan `type.slot`, `ability.slot` y `stat.name` como `key`, para que React identifique cada elemento repetido.

Codigo de `BakemonDisplay` para tipos, habilidades y estadisticas:

```tsx
<div className="type-list">
	{bakemon.types.map((type) => (
		<span key={type.slot}>{type.type}</span>
	))}
</div>

<ul>
	{bakemon.abilities.map((ability) => (
		<li key={ability.slot}>{formatName(ability.name)}</li>
	))}
</ul>

<ul>
	{bakemon.stats.map((stat) => (
		<li key={stat.name}>
			{formatName(stat.name)}: {stat.base_value}
		</li>
	))}
</ul>
<strong>Total: {getBaseStatTotal(bakemon)}</strong>
```

## P3 - `MovesList`

`MovesList` recibe una lista de movimientos completos. Antes de renderizarla, `BakemonDisplay` llama a `getMovesForBakemon`: cada id guardado en el Bakemon se busca en el arreglo `moves` mediante `find`.

De cada movimiento se muestran el nombre, el tipo, la potencia o el texto `Sin potencia`, y `effect_entry` como descripcion. El `id` del movimiento funciona como `key`.

Codigo de `MovesList`:

```tsx
function MovesList({ moves }: { moves: BakemonMove[] }) {
	return <div className="moves-list">
		{moves.map((move) => (
			<article key={move.id}>
				<strong>{formatName(move.name)}</strong>
				<span>{move.type}</span>
				<span>{move.power === null ? 'Sin potencia' : move.power}</span>
				<p>{move.effect_entry}</p>
			</article>
		))}
	</div>
}
```

## P4 - Expandir movimientos

`BakemonDisplay` declara el estado local:

```tsx
const [movesExpanded, setMovesExpanded] = useState(false)
```

El boton invierte ese booleano. La expresion condicional solo monta `MovesList` cuando el estado vale `true`; al pulsar de nuevo, la lista se oculta.

Codigo del boton y del renderizado condicional:

```tsx
<button
	type="button"
	onClick={() => setMovesExpanded((expanded) => !expanded)}
>
	{movesExpanded ? 'Ocultar movimientos' : 'Expandir movimientos'}
</button>
{movesExpanded ? <MovesList moves={resolvedMoves} /> : null}
```

## P5 - Lista y detalle

`App` guarda el id del Bakemon seleccionado:

```tsx
const [selectedId, setSelectedId] = useState<number | null>(null)
```

La lista actualiza ese estado al hacer click. `App` busca el objeto correspondiente y pasa el resultado a `BakemonDisplay`. El boton de volver vuelve a poner el estado en `null`, por lo que se muestra otra vez el catalogo.

El estado vive en `App` porque tanto la lista como el detalle necesitan conocer la seleccion.

Codigo de la seleccion y del boton para volver:

```tsx
const selected = bakemons.find((bakemon) => bakemon.id === selectedId)

<button type="button" onClick={() => setSelectedId(bakemon.id)}>
	{formatName(bakemon.name)}
</button>

{selected ? (
	<>
		<button type="button" onClick={() => setSelectedId(null)}>
			Volver al catalogo
		</button>
		<BakemonDisplay bakemon={selected} />
	</>
) : <p>Elige un Bakemon</p>}
```

## P6 - Constructor de equipos

El equipo se representa como `number[]`, guardando ids y no copias completas de los objetos. `toggleTeam` usa el actualizador funcional de `setTeam` y crea arreglos nuevos con `filter` o spread:

- Si el id ya existe, `filter` lo quita.
- Si no existe y hay menos de seis integrantes, `[...currentTeam, id]` lo agrega.
- Si ya hay seis, el estado queda igual y el boton de agregar aparece deshabilitado.
- `includes` impide agregar el mismo Bakemon dos veces.

La cuadricula siempre crea seis celdas. Cada celda busca su miembro por id y muestra `Espacio libre` cuando no hay uno asignado.

## Tests por pregunta

### Test P1 - Conceptos de React

Verificacion conceptual:

1. Identificar `BakemonDisplay` como componente y `formatName` como funcion auxiliar.
2. Identificar `bakemon` y `moves` como props, y `selectedId`, `team`, `query` y `movesExpanded` como estados.
3. Revisar que el JSX use `className` y llaves `{ }` para insertar expresiones.

Resultado esperado: se distingue correctamente entre componente, props, state, JSX y HTML.

### Test P2 - `BakemonDisplay`

1. Ejecutar la aplicacion con `npm run dev`.
2. Hacer click en `bulbasaur` o en cualquier Bakemon del catalogo.
3. Comprobar que aparecen nombre, numero, tipos, altura, peso, estadisticas, total y habilidades.
4. Revisar que los Bakemons con dos tipos muestran ambos tipos.

Resultado esperado: el panel de detalle muestra toda la informacion del Bakemon seleccionado.

### Test P3 - `MovesList`

1. Seleccionar un Bakemon.
2. Expandir la seccion de movimientos.
3. Revisar un movimiento con potencia numerica y uno con `power: null`, si existen en sus datos.
4. Comprobar que cada movimiento muestra nombre, tipo, potencia o `Sin potencia`, y descripcion.

Resultado esperado: los ids de `bakemon.ts` se cruzan correctamente con los objetos de `moves.ts`.

### Test P4 - Expandir movimientos

1. Seleccionar un Bakemon.
2. Comprobar que los movimientos estan ocultos inicialmente.
3. Pulsar `Expandir movimientos` y verificar que aparecen.
4. Pulsar `Ocultar movimientos` y verificar que desaparecen.

Resultado esperado: el boton cambia el estado local y alterna la visibilidad de `MovesList`.

### Test P5 - Lista y detalle

1. Al abrir la aplicacion, comprobar que se muestra el catalogo.
2. Hacer click en un Bakemon.
3. Verificar que el catalogo deja paso al detalle del Bakemon elegido.
4. Pulsar `Volver al catalogo`.

Resultado esperado: vuelve a aparecer la lista y el detalle deja de mostrarse. La seleccion se conserva en `App`, que es el componente comun.

### Test P6 - Constructor de equipos

1. Pulsar `Agregar` en un Bakemon y comprobar que aparece una celda ocupada.
2. Pulsar nuevamente el boton del mismo Bakemon y comprobar que no se duplica.
3. Agregar Bakemons diferentes hasta completar las seis celdas.
4. Comprobar que los botones `Agregar` quedan deshabilitados cuando el equipo esta lleno.
5. Pulsar `Quitar` y verificar que la celda queda libre y se puede agregar otro Bakemon.

Resultado esperado: el equipo nunca supera seis integrantes, no contiene ids repetidos y se actualiza sin mutar directamente el arreglo anterior.

Codigo del estado y del actualizador del equipo:

```tsx
const [team, setTeam] = useState<number[]>([])

function toggleTeam(bakemon: Bakemon) {
	setTeam((currentTeam) => currentTeam.includes(bakemon.id)
		? currentTeam.filter((id) => id !== bakemon.id)
		: currentTeam.length < 6
			? [...currentTeam, bakemon.id]
			: currentTeam)
}
```

Codigo de los botones de agregar o quitar:

```tsx
const inTeam = team.includes(bakemon.id)

<button
	type="button"
	onClick={() => toggleTeam(bakemon)}
	disabled={!inTeam && team.length === 6}
>
	{inTeam ? 'Quitar' : 'Agregar'}
</button>
```
