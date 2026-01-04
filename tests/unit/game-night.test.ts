import { describe, expect, it } from 'vitest';
import type {
  CompletedGame,
  GameNight,
  Player,
  ScoringMode,
} from '../../src/lib/types';
import {
  calculateGameNightPoints,
  calculateTotalGameNightPoints,
  getGameNightStats,
} from '../../src/lib/utils';

const createPlayer = (id: string, name: string): Player => ({
  id,
  order: 0,
  name,
  rounds: [],
  currVal: 0,
  color: 'blue',
});

const createCompletedGame = (
  id: string,
  playerScores: { [playerId: string]: number },
  winningCondition: 'minNumber' | 'maxNumber' = 'maxNumber',
): CompletedGame => ({
  id,
  name: 'Test Game',
  playerScores,
  winningCondition,
});

describe('calculateGameNightPoints', () => {
  it('should award 1 point to winner in winner-only mode (maxNumber)', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    const game = createCompletedGame('g1', { p1: 100, p2: 50 });
    const points = calculateGameNightPoints(game, players, 'winner-only');

    expect(points.p1).toBe(1);
    expect(points.p2).toBe(0);
  });

  it('should award 1 point to winner in winner-only mode (minNumber)', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    const game = createCompletedGame('g1', { p1: 10, p2: 50 }, 'minNumber');
    const points = calculateGameNightPoints(game, players, 'winner-only');

    expect(points.p1).toBe(1);
    expect(points.p2).toBe(0);
  });

  it('should award game points in game-points mode', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    const game = createCompletedGame('g1', { p1: 100, p2: 50 });
    const points = calculateGameNightPoints(game, players, 'game-points');

    expect(points.p1).toBe(100);
    expect(points.p2).toBe(50);
  });

  it('should award ranked points in ranked mode', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    const game = createCompletedGame('g1', { p1: 100, p2: 50 });
    const points = calculateGameNightPoints(game, players, 'ranked');

    expect(points.p1).toBe(1);
    expect(points.p2).toBe(0);
  });

  it('should award correct ranked points for 3 players', () => {
    const players = [
      createPlayer('p1', 'Alice'),
      createPlayer('p2', 'Bob'),
      createPlayer('p3', 'Charlie'),
    ];
    const game = createCompletedGame('g1', { p1: 100, p2: 50, p3: 75 });
    const points = calculateGameNightPoints(game, players, 'ranked');

    expect(points.p1).toBe(2);
    expect(points.p3).toBe(1);
    expect(points.p2).toBe(0);
  });

  it('should handle missing player scores', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    const game = createCompletedGame('g1', { p1: 100 });
    const points = calculateGameNightPoints(game, players, 'game-points');

    expect(points.p1).toBe(100);
    expect(points.p2).toBe(0);
  });
});

describe('calculateTotalGameNightPoints', () => {
  it('should sum points across multiple games', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    const gameNight = {
      completedGames: [
        createCompletedGame('g1', { p1: 100, p2: 50 }),
        createCompletedGame('g2', { p1: 50, p2: 100 }),
      ],
      scoringMode: 'game-points' as ScoringMode,
    };

    const totalPoints = calculateTotalGameNightPoints(gameNight, players);

    expect(totalPoints.p1).toBe(150);
    expect(totalPoints.p2).toBe(150);
  });

  it('should sum winner-only points correctly', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    const gameNight = {
      completedGames: [
        createCompletedGame('g1', { p1: 100, p2: 50 }),
        createCompletedGame('g2', { p1: 50, p2: 100 }),
        createCompletedGame('g3', { p1: 100, p2: 50 }),
      ],
      scoringMode: 'winner-only' as ScoringMode,
    };

    const totalPoints = calculateTotalGameNightPoints(gameNight, players);

    expect(totalPoints.p1).toBe(2);
    expect(totalPoints.p2).toBe(1);
  });

  it('should handle empty completed games', () => {
    const players = [createPlayer('p1', 'Alice')];
    const gameNight = {
      completedGames: [],
      scoringMode: 'game-points' as ScoringMode,
    };

    const totalPoints = calculateTotalGameNightPoints(gameNight, players);

    expect(totalPoints.p1).toBe(0);
  });
});

describe('getGameNightStats', () => {
  it('should return empty array for null game night', () => {
    const stats = getGameNightStats(null);
    expect(stats).toEqual([]);
  });

  it('should calculate wins and total points correctly', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    const gameNight: GameNight = {
      players,
      scoringMode: 'winner-only',
      completedGames: [
        createCompletedGame('g1', { p1: 100, p2: 50 }),
        createCompletedGame('g2', { p1: 50, p2: 100 }),
        createCompletedGame('g3', { p1: 100, p2: 50 }),
      ],
      isFinished: false,
    };

    const stats = getGameNightStats(gameNight);

    expect(stats[0].id).toBe('p1');
    expect(stats[0].wins).toBe(2);
    expect(stats[0].totalPoints).toBe(2);
    expect(stats[1].id).toBe('p2');
    expect(stats[1].wins).toBe(1);
    expect(stats[1].totalPoints).toBe(1);
  });

  it('should sort by total points descending', () => {
    const players = [createPlayer('p1', 'Alice'), createPlayer('p2', 'Bob')];
    const gameNight: GameNight = {
      players,
      scoringMode: 'game-points',
      completedGames: [createCompletedGame('g1', { p1: 50, p2: 100 })],
      isFinished: false,
    };

    const stats = getGameNightStats(gameNight);

    expect(stats[0].id).toBe('p2');
    expect(stats[1].id).toBe('p1');
  });
});
