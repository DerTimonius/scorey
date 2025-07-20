import { useAtom } from 'jotai/react';
import { gameAtom, playerAtom } from '@/lib/jotai';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';
import { GameChart, type GameChartDataItem } from '../charts/GameChart';
import { PlayerStats } from '../player/PlayerStats';
import { Button } from '../ui/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import type { ChartConfig } from '../ui/chart';

export function GameStats() {
  const [game, setGame] = useAtom(gameAtom);
  const [players, setPlayers] = useAtom(playerAtom);

  if (!game || !game.finished || !players.length) return;

  const sortedPlayers = players.toSorted((a, b) =>
    game.winningCondition === 'maxNumber'
      ? b.currVal - a.currVal
      : a.currVal - b.currVal,
  );
  const winner = sortedPlayers[0];

  const handleNewGame = () => {
    setGame(null);
    setPlayers([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-18 py-8">
      <Card className="w-[80vw]">
        <CardHeader>
          <CardTitle className="text-center text-5xl">
            And the winner is {winner.name} with {winner.currVal} points!
          </CardTitle>
          <CardDescription className="mt-6">
            {sortedPlayers.slice(1).map((p) => (
              <p key={p.id} className="text-center font-semibold text-lg">
                - {p.name}: {p.currVal} points
              </p>
            ))}
          </CardDescription>
        </CardHeader>
        <div
          className={cn('flex flex-col items-center justify-around gap-2 px-3')}
        >
          <h3 className="mb-2 text-center font-bold text-2xl">
            How it happened
          </h3>
          <GameChart
            chartConfig={createChartConfig(players)}
            data={transformPlayersToCumulativeChartData(players)}
            players={players}
          />
          <div
            className={cn(
              'mt-4 grid w-full gap-2',
              players.length <= 4
                ? 'grid-cols-2'
                : players.length <= 8
                  ? 'grid-cols-4'
                  : 'grid-cols-6',
            )}
          >
            {sortedPlayers.map((p) => (
              <PlayerStats key={p.id} player={p} />
            ))}
          </div>
        </div>
        <CardAction className="flex w-full flex-row items-center justify-around">
          <Button onClick={handleNewGame}>New Game</Button>
        </CardAction>
      </Card>
    </main>
  );
}

function transformPlayersToCumulativeChartData(
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

function createChartConfig(players: Player[]): ChartConfig {
  return players.reduce((acc, player) => {
    acc[player.name] = {
      label: player.name,
      color: 'var(--chart-1)',
    };

    return acc;
  }, {} as ChartConfig);
}
