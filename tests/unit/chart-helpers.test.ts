import { describe, expect, it } from 'vitest';
import {
  createChartConfig,
  transformPlayersToCumulativeChartData,
} from '../../src/lib/chartHelpers';
import type { Player } from '../../src/lib/types';

const createPlayer = (
  id: string,
  name: string,
  rounds: number[] = [],
): Player => ({
  id,
  order: 0,
  name,
  rounds,
  currVal: 0,
  color: 'blue',
});

describe('transformPlayersToCumulativeChartData', () => {
  it('should return empty array for empty players', () => {
    expect(transformPlayersToCumulativeChartData([])).toEqual([]);
  });

  it('should return empty array for null/undefined', () => {
    expect(
      transformPlayersToCumulativeChartData(null as unknown as Player[]),
    ).toEqual([]);
    expect(
      transformPlayersToCumulativeChartData(undefined as unknown as Player[]),
    ).toEqual([]);
  });

  it('should return empty array when players have no rounds', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    expect(transformPlayersToCumulativeChartData(players)).toEqual([]);
  });

  it('should calculate cumulative scores correctly for single round', () => {
    const players = [
      createPlayer('p1', 'Alice', [10]),
      createPlayer('p2', 'Bob', [5]),
    ];
    const result = transformPlayersToCumulativeChartData(players);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ round: '1', Alice: 10, Bob: 5 });
  });

  it('should calculate cumulative scores correctly for multiple rounds', () => {
    const players = [
      createPlayer('p1', 'Alice', [10, 5, 15]),
      createPlayer('p2', 'Bob', [5, 10, 5]),
    ];
    const result = transformPlayersToCumulativeChartData(players);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ round: '1', Alice: 10, Bob: 5 });
    expect(result[1]).toEqual({ round: '2', Alice: 15, Bob: 15 });
    expect(result[2]).toEqual({ round: '3', Alice: 30, Bob: 20 });
  });

  it('should handle players with different number of rounds', () => {
    const players = [
      createPlayer('p1', 'Alice', [10, 5, 15]),
      createPlayer('p2', 'Bob', [5]),
    ];
    const result = transformPlayersToCumulativeChartData(players);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ round: '1', Alice: 10, Bob: 5 });
    expect(result[1]).toEqual({ round: '2', Alice: 15, Bob: 5 });
    expect(result[2]).toEqual({ round: '3', Alice: 30, Bob: 5 });
  });

  it('should handle single player', () => {
    const players = [createPlayer('p1', 'Alice', [10, 20, 30])];
    const result = transformPlayersToCumulativeChartData(players);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ round: '1', Alice: 10 });
    expect(result[1]).toEqual({ round: '2', Alice: 30 });
    expect(result[2]).toEqual({ round: '3', Alice: 60 });
  });
});

describe('createChartConfig', () => {
  it('should create empty config for empty players', () => {
    const result = createChartConfig([]);
    expect(result).toEqual({});
  });

  it('should create config for single player', () => {
    const players = [createPlayer('p1', 'Alice')];
    const result = createChartConfig(players);

    expect(result).toEqual({
      Alice: {
        label: 'Alice',
        color: 'var(--chart-blue)',
      },
    });
  });

  it('should create config for multiple players', () => {
    const players = [
      createPlayer('p1', 'Alice'),
      createPlayer('p2', 'Bob'),
      createPlayer('p3', 'Charlie'),
    ];
    const result = createChartConfig(players);

    expect(result).toEqual({
      Alice: { label: 'Alice', color: 'var(--chart-blue)' },
      Bob: { label: 'Bob', color: 'var(--chart-blue)' },
      Charlie: { label: 'Charlie', color: 'var(--chart-blue)' },
    });
  });

  it('should use player color in config', () => {
    const players = [
      { ...createPlayer('p1', 'Alice'), color: 'red' as const },
      { ...createPlayer('p2', 'Bob'), color: 'green' as const },
    ];
    const result = createChartConfig(players);

    expect(result).toEqual({
      Alice: { label: 'Alice', color: 'var(--chart-red)' },
      Bob: { label: 'Bob', color: 'var(--chart-green)' },
    });
  });
});
