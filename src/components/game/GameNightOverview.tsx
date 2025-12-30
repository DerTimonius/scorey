import { useAtom, useAtomValue } from 'jotai/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { gameNightAtom, mainColorAtom, playerAtom } from '@/lib/jotai';
import type { GameNight } from '@/lib/types';
import {
  calculateGameNightPoints,
  calculateTotalGameNightPoints,
  cn,
} from '@/lib/utils';
import { GameChart } from '../charts/GameChart';
import { Button } from '../ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface GameNightChartDataItem {
  round: string;
  [playerName: string]: string | number;
}

function transformGameNightToChartData(
  gameNight: GameNight,
): GameNightChartDataItem[] {
  if (!gameNight || gameNight.completedGames.length === 0) {
    return [];
  }

  const chartData: GameNightChartDataItem[] = [];

  const cumulativeScores: { [playerName: string]: number } = {};

  gameNight.players.forEach((player) => {
    cumulativeScores[player.name] = 0;
  });

  gameNight.completedGames.forEach((game) => {
    const dataItem: GameNightChartDataItem = {
      round: game.name,
    };

    const gamePoints = calculateGameNightPoints(
      game,
      gameNight.players,
      gameNight.scoringMode,
    );

    gameNight.players.forEach((player) => {
      const name = player.name;
      const points = gamePoints[player.id] ?? 0;

      cumulativeScores[name] += points;
      dataItem[name] = cumulativeScores[name];
    });

    chartData.push(dataItem);
  });

  return chartData;
}

function createChartConfig(players: { name: string; color: string }[]) {
  return players.reduce(
    (acc, player) => {
      acc[player.name] = {
        label: player.name,
        color: `var(--chart-${player.color})`,
      };

      return acc;
    },
    {} as { [key: string]: { label: string; color: string } },
  );
}

export function GameNightOverview() {
  const { t } = useTranslation();
  const mainColor = useAtomValue(mainColorAtom);
  const [gameNight, setGameNight] = useAtom(gameNightAtom);
  const [players, setPlayers] = useAtom(playerAtom);

  const chartData = useMemo(() => {
    if (!gameNight) return [];

    return transformGameNightToChartData(gameNight);
  }, [gameNight]);

  const totalPoints = useMemo(() => {
    if (!gameNight) return {};

    return calculateTotalGameNightPoints(gameNight, gameNight.players);
  }, [gameNight]);

  const sortedPlayers = useMemo(() => {
    if (!gameNight) return [];

    return [...gameNight.players].sort(
      (a, b) => totalPoints[b.id] - totalPoints[a.id],
    );
  }, [gameNight, totalPoints]);

  if (!gameNight || !gameNight.isFinished) return null;

  const overallWinner = sortedPlayers[0];

  const handleNewGame = () => {
    setGameNight(null);
    setPlayers([]);
  };

  return (
    <div className="flex min-h-min flex-col items-center gap-8 py-12">
      <h1 className="text-center font-display font-extrabold text-5xl md:text-6xl">
        {t('game:game-night.total-ranking')}
      </h1>
      <Card
        className="w-[80vw]"
        color={mainColor}
        data-test-id="game-night-overview"
      >
        <CardHeader>
          <CardTitle
            className="text-center font-display text-5xl"
            data-test-id="game-night-winner-message"
          >
            {t('game:game-stats.winner-message', {
              winnerName: overallWinner.name,
              winnerScore: totalPoints[overallWinner.id],
            })}
          </CardTitle>
          <CardDescription className="mt-6">
            {sortedPlayers.slice(1).map((p) => (
              <p key={p.id} className="text-center font-semibold text-lg">
                {t('game:game-stats.player-score', {
                  playerName: p.name,
                  playerScore: totalPoints[p.id],
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
            data={chartData}
            players={players}
            gameNight
          />
        </div>
      </Card>
      <div className="mb-12 flex flex-row justify-center gap-8">
        <Button
          data-test-id="new-game-night-button"
          onClick={handleNewGame}
          color={mainColor}
        >
          {t('game:new-game.button')}
        </Button>
      </div>
    </div>
  );
}
