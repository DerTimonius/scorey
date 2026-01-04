import { useAtom, useAtomValue } from 'jotai/react';
import { motion, useAnimation, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { easeOut } from '@/lib/animations';
import {
  gameAtom,
  gameNightAtom,
  mainColorAtom,
  playerAtom,
} from '@/lib/jotai';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AnimatedName, AnimatedScore } from '../animation/Animations';
import { GameChart, type GameChartDataItem } from '../charts/GameChart';
import { Layout } from '../layout/Layout';
import { PlayerStats } from '../player/PlayerStats';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { ChartConfig } from '../ui/chart';
import { GameNightStats } from './GameNightStats';
import { GameNightButtons, SingleGameButtons } from './GameStatsButtons';

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
  const [gameNight, setGameNight] = useAtom(gameNightAtom);

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

  const handleNextGame = () => {
    if (!gameNight) return;

    setGame(null);
  };

  const handleFinishGameNight = () => {
    if (!gameNight) return;

    setGame(null);
    setGameNight((prev) => (prev ? { ...prev, isFinished: true } : null));
  };

  return (
    <Layout className="min-h-min py-12">
      <h1 className="text-center font-display font-extrabold text-5xl md:text-6xl">
        {game.name}
      </h1>
      <motion.div
        initial={{ scale: 0.7, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={easeOut}
      >
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
              <motion.span
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...easeOut, delay: 0.3 }}
              >
                <Trans
                  i18nKey="game:game-stats.winner-message"
                  values={{
                    winnerName: winner.name,
                  }}
                  components={{
                    name: <AnimatedName />,
                    score: <AnimatedScore value={winner.currVal} />,
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
                    playerScore: p.currVal,
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
              {sortedPlayers.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 4 + 0.2 * idx }}
                >
                  <PlayerStats player={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Card>
      </motion.div>
      {gameNight ? <GameNightStats /> : null}
      <div className="mb-12 flex flex-row justify-center gap-8">
        {gameNight ? (
          <GameNightButtons
            handleNewGame={handleNextGame}
            handleNewRound={handleNewRound}
            handleFinishGameNight={handleFinishGameNight}
          />
        ) : (
          <SingleGameButtons
            handleNewGame={handleNewGame}
            handleNewRound={handleNewRound}
            handleKeepPlayers={handleKeepPlayers}
          />
        )}
      </div>
    </Layout>
  );
}
