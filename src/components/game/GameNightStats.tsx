import { useAtomValue } from 'jotai/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { gameAtom, gameNightAtom, mainColorAtom } from '@/lib/jotai';
import { calculateTotalGameNightPoints, cn } from '@/lib/utils';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function GameNightStats() {
  const { t } = useTranslation();
  const mainColor = useAtomValue(mainColorAtom);
  const game = useAtomValue(gameAtom);
  const gameNight = useAtomValue(gameNightAtom);

  const { totalPoints, wins, sortedPlayers } = useMemo(() => {
    if (!game || !gameNight) {
      return { totalPoints: {}, wins: {}, sortedPlayers: [] };
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

    const sortedPlayers = [...gameNight.players].sort(
      (a, b) => totalPoints[b.id] - totalPoints[a.id],
    );

    return { totalPoints, wins, sortedPlayers };
  }, [game, gameNight]);

  if (!game || !gameNight) return null;

  return (
    <Card
      className="my-8 w-[80vw]"
      color={mainColor}
      data-test-id="game-night-stats"
    >
      <CardHeader>
        <CardTitle
          className="text-center font-display text-3xl md:text-4xl"
          data-test-id="game-night-title"
        >
          {t('game:game-night.total-ranking')}
        </CardTitle>
        <CardDescription className="text-center text-lg">
          {t('game:game-night.games-played', {
            count: gameNight.completedGames.length,
          })}
        </CardDescription>
      </CardHeader>
      <div
        className={cn(
          'flex flex-col items-center justify-around gap-4 px-6 py-4',
        )}
      >
        <h3 className="mb-2 text-center font-bold text-2xl">
          {t('game:game-night.total-points')}
        </h3>
        <ol className="w-full list-inside list-decimal space-y-3 px-12">
          {sortedPlayers.map((player, index) => (
            <li
              key={player.id}
              className={cn(
                'grid grid-cols-[2fr_1fr_1fr] rounded-lg bg-opacity-20 p-3',
                index === 0 && 'font-bold',
              )}
            >
              <span className="flex items-center gap-3">{player.name}</span>
              <p className="font-semibold">
                <span className="font-light text-sm">
                  {t('state:current-score')}:
                </span>{' '}
                {totalPoints[player.id]}
              </p>
              <p>
                <span className="font-light text-sm">
                  {t('game:game-night.wins')}:
                </span>{' '}
                {wins[player.id]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
