import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CompletedGame, GameNight, Player, ScoringMode } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateGameNightPoints(
  completedGame: CompletedGame,
  players: Player[],
  scoringMode: ScoringMode,
): { [playerId: string]: number } {
  const points: { [playerId: string]: number } = {};
  const playerIds = players.map((p) => p.id);

  if (scoringMode === 'winner-only') {
    const sortedPlayers = playerIds.sort((a, b) => {
      const scoreA = completedGame.playerScores[a] ?? 0;
      const scoreB = completedGame.playerScores[b] ?? 0;
      if (completedGame.winningCondition === 'maxNumber') {
        return scoreB - scoreA;
      }
      return scoreA - scoreB;
    });

    if (sortedPlayers.length > 0) {
      points[sortedPlayers[0]] = 1;
    }

    sortedPlayers.slice(1).forEach((id) => {
      points[id] = 0;
    });
  } else if (scoringMode === 'game-points') {
    players.forEach((player) => {
      points[player.id] = completedGame.playerScores[player.id] ?? 0;
    });
  } else if (scoringMode === 'ranked') {
    const sortedPlayers = playerIds.sort((a, b) => {
      const scoreA = completedGame.playerScores[a] ?? 0;
      const scoreB = completedGame.playerScores[b] ?? 0;
      if (completedGame.winningCondition === 'maxNumber') {
        return scoreB - scoreA;
      }
      return scoreA - scoreB;
    });

    const n = sortedPlayers.length;
    sortedPlayers.forEach((id, index) => {
      points[id] = n - 1 - index;
    });
  }

  return points;
}

export function calculateTotalGameNightPoints(
  gameNight: {
    completedGames: CompletedGame[];
    scoringMode: ScoringMode;
  },
  players: Player[],
): { [playerId: string]: number } {
  const totalPoints: { [playerId: string]: number } = {};

  players.forEach((player) => {
    totalPoints[player.id] = 0;
  });

  gameNight.completedGames.forEach((game) => {
    const gamePoints = calculateGameNightPoints(
      game,
      players,
      gameNight.scoringMode,
    );
    Object.entries(gamePoints).forEach(([playerId, points]) => {
      totalPoints[playerId] += points;
    });
  });

  return totalPoints;
}

export function getGameNightStats(
  gameNight: GameNight | null,
): (Player & { wins: number; totalPoints: number })[] {
  if (!gameNight) {
    return [];
  }

  const totalPoints = calculateTotalGameNightPoints(
    gameNight,
    gameNight.players,
  );

  const wins: { [playerId: string]: number } = {};
  gameNight.players.forEach((player) => {
    wins[player.id] = 0;
  });

  gameNight.completedGames.forEach((completedGame) => {
    const gameSortedPlayers = [...gameNight.players].sort((a, b) => {
      const scoreA = completedGame.playerScores[a.id] ?? 0;
      const scoreB = completedGame.playerScores[b.id] ?? 0;
      if (completedGame.winningCondition === 'maxNumber') {
        return scoreB - scoreA;
      }
      return scoreA - scoreB;
    });

    if (gameSortedPlayers.length > 0) {
      wins[gameSortedPlayers[0].id] += 1;
    }
  });

  return gameNight.players
    .map((player) => ({
      ...player,
      wins: wins[player.id] ?? 0,
      totalPoints: totalPoints[player.id] ?? 0,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
}
