import { motion } from 'motion/react';
import { useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { easeOut } from '@/lib/animations';
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
import { AnimatedName, AnimatedScore } from '../animation/Animations';
import { useAtomValue, useAtom } from 'jotai';

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
    return players.sort((a, b) => totalPoints[b.id] - totalPoints[a.id]);
  }, [players, totalPoints]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  if (!gameNight || !gameNight.isFinished || !sortedPlayers.length) return null;

  const overallWinner = sortedPlayers[0];

  const handleNewGame = () => {
    setGameNight(null);
    setPlayers([]);
  };

  return (
    <div className="flex min-h-min flex-col items-center gap-8 py-12">
      <motion.h1
        className="text-center font-display font-extrabold text-5xl md:text-6xl"
        data-test-id="game-night-title"
        initial={{ scale: 0.7, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={easeOut}
      >
        {t('game:game-night.total-ranking')}
      </motion.h1>
      <motion.div
        initial={{ scale: 0.7, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={easeOut}
      >
        <Card
          className="w-[80vw]"
          color={mainColor}
          data-test-id="game-night-overview"
        >
          <CardHeader>
            <CardTitle
              className="text-center font-display text-5xl"
              data-test-id="winner-message"
            >
              <motion.span
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...easeOut, delay: 0.3 }}
              >
                <Trans
                  i18nKey="game:game-stats.winner-message"
                  values={{
                    winnerName: overallWinner.name,
                  }}
                  components={{
                    name: <AnimatedName />,
                    score: (
                      <AnimatedScore value={totalPoints[overallWinner.id]} />
                    ),
                  }}
                />
              </motion.span>
            </CardTitle>
            <CardDescription className="mt-6">
              {sortedPlayers.slice(1).map((p, idx) => (
                <motion.p
                  key={p.id}
                  className="text-center font-semibold text-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...easeOut, delay: 2.5 + 0.2 * idx }}
                >
                  {t('game:game-stats.player-score', {
                    playerName: p.name,
                    playerScore: totalPoints[p.id],
                  })}
                </motion.p>
              ))}
            </CardDescription>
          </CardHeader>
          <motion.div
            className={cn(
              'flex flex-col items-center justify-around gap-2 px-3',
            )}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              ...easeOut,
              delay: 3.4,
              duration: 0.5,
            }}
          >
            <h3 className="mb-2 text-center font-bold text-2xl">
              {t('game:game-stats.how-it-happened')}
            </h3>

            <GameChart
              chartConfig={createChartConfig(sortedPlayers)}
              data={chartData}
              players={players}
              gameNight
              animationDelay={3400}
            />
          </motion.div>
        </Card>
      </motion.div>
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
