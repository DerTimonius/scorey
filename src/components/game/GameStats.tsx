import { useAtom, useAtomValue } from 'jotai/react';
import { useTranslation } from 'react-i18next';
import {
  gameAtom,
  gameNightAtom,
  mainColorAtom,
  playerAtom,
} from '@/lib/jotai';
import { cn } from '@/lib/utils';
import { GameChart } from '../charts/GameChart';
import { Layout } from '../layout/Layout';
import { PlayerStats } from '../player/PlayerStats';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { GameNightStats } from './GameNightStats';
import { GameNightButtons, SingleGameButtons } from './GameStatsButtons';
import {
  createChartConfig,
  transformPlayersToCumulativeChartData,
} from '@/lib/chartHelpers';

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
      </Card>
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
