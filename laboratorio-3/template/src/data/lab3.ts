import bakemonData from './bakemon'
import moveData from './moves'

export interface Ability {
    name: string
    is_hidden: boolean
    slot: number
}

export interface Stat {
    name: string
    base_value: number
    effort: number
}

export interface Type {
    type: string
    slot: number
}

export interface StatChange {
    stat: string
    change: number
}


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

export interface BakemonMove {
    id: number
    name: string
    damage_class: string
    power: number | null
    pp: number
    priority: number
    stat_changes: StatChange[]
    target: string
    type: string
    ailment: string
    effect_entry: string
}

export const bakemons = bakemonData as Bakemon[]
export const moves = moveData as BakemonMove[]

export function getBaseStatTotal(bakemon: Bakemon): number {
    return bakemon.stats.reduce((total, stat) => total + stat.base_value, 0)
}

export function getMovesForBakemon(bakemon: Bakemon): BakemonMove[] {
    return bakemon.moves
        .map((moveId) => moves.find((move) => move.id === moveId))
        .filter((move): move is BakemonMove => move !== undefined)
}
