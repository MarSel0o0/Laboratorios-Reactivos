export type BakemonMoveStatChange = {
  stat: string;
  change: number;
};

export type BakemonMove = {
  id: number;
  name: string;
  damage_class: string;
  power: number | null;
  pp: number;
  priority: number;
  stat_changes: BakemonMoveStatChange[];
  target: string;
  type: string;
  ailment: string;
  effect_entry: string;
};

export type BakemonStat = {
  name: string;
  base_value: number;
  effort: number;
};

export type BakemonType = {
  type: string;
  slot: number;
};

export type BakemonAbility = {
  name: string;
  is_hidden: boolean;
  slot: number;
};

export type Bakemon = {
  id: number;
  name: string;
  abilities: BakemonAbility[];
  height: number;
  weight: number;
  moves: number[];
  stats: BakemonStat[];
  types: BakemonType[];
};
