import { useAtom, useAtomValue } from 'jotai/react';
import { useTranslation } from 'react-i18next';
import { gameAtom, mainColorAtom, playerAtom } from '@/lib/jotai';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';
import { GameChart, type GameChartDataItem } from '../charts/GameChart';
import { Layout } from '../layout/Layout';
import { PlayerStats } from '../player/PlayerStats';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import type { ChartConfig } from '../ui/chart';

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
      color: `var(--chart-${player.color})`,
    };

    return acc;
  }, {} as ChartConfig);
}

export function GameStats() {
  const mainColor = useAtomValue(mainColorAtom);
  const { t } = useTranslation();
  const [game, setGame] = useAtom(gameAtom);
  const [players, setPlayers] = useAtom(playerAtom);

  if (!game || !game.finished || !players.length) return;

  const sortedPlayers = players.toSorted((a, b) =>
    game.winningCondition === 'maxNumber'
      ? b.currVal - a.currVal
      : a.currVal - b.currVal,
  );
  const winner = sortedPlayers[0];

  const handleNewRound = () => {
    setGame((prev) => (prev ? { ...prev, finished: false } : null));
    setPlayers((prev) =>
      prev.map((p) => ({ ...p, rounds: [], currVal: game.startValue ?? 0 })),
    );
  };

  const handleKeepPlayers = () => {
    setGame(null);
  };

  const handleNewGame = () => {
    setGame(null);
    setPlayers([]);
  };

  return (
    <Layout className="min-h-min py-12">
      <h1 className="text-center font-display font-extrabold text-5xl md:text-6xl">
        {game.name}
      </h1>
      <Card
        className="w-[80vw]"
        color={mainColor}
        data-test-id="game-stats-card"
      >
        <CardHeader>
          <CardTitle
            className="text-center font-display text-5xl"
            data-test-id="winner-message"
          >
            {t('game:game-stats.winner-message', {
              winnerName: winner.name,
              winnerScore: winner.currVal,
            })}
          </CardTitle>
          <CardDescription className="mt-6">
            {sortedPlayers.slice(1).map((p) => (
              <p key={p.id} className="text-center font-semibold text-lg">
                {t('game:game-stats.player-score', {
                  playerName: p.name,
                  playerScore: p.currVal,
                })}
              </p>
            ))}
          </CardDescription>
        </CardHeader>
        <div
          className={cn('flex flex-col items-center justify-around gap-2 px-3')}
        >
          <h3 className="mb-2 text-center font-bold text-2xl">
            {t('game:game-stats.how-it-happened')}
          </h3>
          <GameChart
            chartConfig={createChartConfig(players)}
            data={transformPlayersToCumulativeChartData(players)}
            players={players}
          />
          <div
            className={cn(
              'mt-4 grid w-full grid-cols-1 gap-2',
              players.length <= 4
                ? 'md:grid-cols-2'
                : players.length <= 8
                  ? 'md:grid-cols-4'
                  : 'md:grid-cols-6',
            )}
          >
            {sortedPlayers.map((p) => (
              <PlayerStats key={p.id} player={p} />
            ))}
          </div>
        </div>
        <CardAction className="flex w-full flex-row items-center justify-around">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button data-test-id="new-game-button" color={mainColor}>
                {t('game:new-game.button')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              color={mainColor}
              data-test-id="new-game-dialog"
            >
              <AlertDialogHeader>
                <AlertDialogTitle>{t('game:new-game.title')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('game:new-game.description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex justify-end gap-3 sm:flex-col">
                <AlertDialogAction
                  onClick={handleNewGame}
                  color={mainColor}
                  data-test-id="confirm-new-game"
                >
                  {t('game:new-game.all-new')}
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={handleNewRound}
                  color={mainColor}
                  data-test-id="confirm-new-round"
                >
                  {t('game:new-game.new-round')}
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={handleKeepPlayers}
                  color={mainColor}
                  data-test-id="confirm-keep-players"
                >
                  {t('game:new-game.keep-players')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </Card>
    </Layout>
  );
}
