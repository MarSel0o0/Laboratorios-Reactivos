
export interface Ability {
  name: string;
  is_hidden: boolean;
  slot: number;
}

export interface Stat {
  name: string;
  base_value: number;
  effort: number;
}

export interface BakemonType {
  type: string;
  slot: number;
}

export interface Bakemon {
  id: number;
  name: string;
  abilities: Ability[];
  height: number;
  weight: number;
  moves: number[];
  stats: Stat[];
  types: BakemonType[];
}

export interface StatChange {
  stat: string;
  change: number;
}

export interface BakemonMove {
  id: number;
  name: string;
  damage_class: string;
  power: number | null;
  pp: number;
  priority: number;
  stat_changes: StatChange[];
  target: string;
  type: string;
  ailment: string;
  effect_entry: string;
}