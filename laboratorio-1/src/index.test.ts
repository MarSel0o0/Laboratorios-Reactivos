import { describe, it, expect } from 'vitest';
import {
  filterByType,
  calculateBST,
  addBST,
  findStrongestByType,
  findStrongestMoveByType,
  TYPES,
  Type,
  Bakemon,
  Move,
  BakemonWithBST
} from './index';

// Importar los datos de prueba
const data = require('../bakemons.json') as Bakemon[];

describe('filterByType', () => {
  TYPES.forEach((type: Type) => {
    it(`should return a Bakemon array where all his bakemons are type ${type}`, () => {
      const bakemons: Bakemon[] = filterByType(data, type);
      bakemons.forEach((bakemon: Bakemon) => {
        expect([bakemon.type, bakemon.secondaryType]).toContain(type);
      });
    });
  });
});

describe('addBST', () => {
  const bakemonsWithBST: BakemonWithBST[] = addBST(data);
  it('each bakemon must have an additional attribute "bst" and be type BakemonWithBST', () => {
    bakemonsWithBST.forEach((bakemon: Bakemon) => {
      expect(bakemon).toHaveProperty(
          "bst", calculateBST(bakemon)
      );
    });
  });
});

const mock = require('../mock.json') as Bakemon[];

describe('findStrongestByType', () => {
  const strongest: Partial<Record<Type, BakemonWithBST>> = findStrongestByType(mock);
  it("should find the strongest of each type based on the BST stat", () => {
    expect(strongest['FIRE']).toBeDefined();
    expect(strongest['FIRE']?.name).toBe('FuegoPoderoso');
    expect(strongest['FIRE']?.bst).toBe(600
    );

    expect(strongest['WATER']).toBeDefined();
    expect(strongest['WATER']?.name).toBe('AguaDios');
  });

  it("for the types who doesn't have an bakemon in the list, must be undefined", () => {
    TYPES.forEach((type: Type) => {
      if (!(type === "FIRE" || type === "WATER")) {
        expect(strongest[type]).toBeUndefined();
      }
    });
  })
});

describe("findStrongestMoveByType", () => {
  const strongestMove: Partial<Record<Type, Move>> = findStrongestMoveByType(mock);
  it("should find the strongest of each type", () => {
    expect(strongestMove['FIRE']).toBeDefined();
    expect(strongestMove['FIRE']?.name).toBe("Llamarada");
    expect(strongestMove['FIRE']?.power).toBe(110);
  });

  it("some types could not be in the partial record", () => {
    TYPES.forEach((type: Type) => {
      if (type !== "FIRE") {
        expect(strongestMove[type]).toBeUndefined();
      }
    });
  });
});