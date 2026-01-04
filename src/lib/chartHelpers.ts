import type { Player } from './types';
import type { ChartConfig } from '@/components/ui/chart';

export interface GameChartDataItem {
  round: string;
  [player: string]: number | string;
}

export function transformPlayersToCumulativeChartData(
  players: Player[],
): GameChartDataItem[] {
  if (!players || players.length === 0) {
    return [];
  }

  const maxRounds = Math.max(...players.map((p) => p.rounds.length));
  if (maxRounds === 0) {
    return [];
  }

  const chartData: GameChartDataItem[] = [];
  const cumulativeScores: { [playerName: string]: number } = {};

  players.forEach((player) => {
    cumulativeScores[player.name] = 0;
  });

  for (let i = 0; i < maxRounds; i++) {
    const dataItem: GameChartDataItem = { round: (i + 1).toString() };

    players.forEach((player) => {
      const name = player.name;
      const scoreForThisRound = player.rounds[i];

      if (scoreForThisRound !== undefined) {
        cumulativeScores[name] += scoreForThisRound;
        dataItem[name] = cumulativeScores[name];
      } else {
        dataItem[name] = cumulativeScores[name];
      }
    });
    chartData.push(dataItem);
  }

  return chartData;
}

export function createChartConfig(players: Player[]): ChartConfig {
  return players.reduce((acc, player) => {
    acc[player.name] = {
      label: player.name,
      color: `var(--chart-${player.color})`,
    };

    return acc;
  }, {} as ChartConfig);
}
