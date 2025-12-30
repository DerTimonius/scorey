import { useAtom, useAtomValue } from 'jotai/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import {
  gameAtom,
  gameNightAtom,
  mainColorAtom,
  playerAtom,
} from '@/lib/jotai';
import type { CompletedGame } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Layout } from '../layout/Layout';
import { PlayerCard } from '../player/PlayerCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { EditGameForm } from './EditGameForm';
import { QuickOverview } from './QuickOverview';

export function GameState() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const mainColor = useAtomValue(mainColorAtom);
  const [game, setGame] = useAtom(gameAtom);
  const [players, setPlayers] = useAtom(playerAtom);
  const [gameNight, setGameNight] = useAtom(gameNightAtom);
  const [enforceRounds, setEnforceRounds] = useState(true);
  const [showStats, setShowStats] = useState(!isMobile);

  const minLength = Math.min(...players.map((p) => p.rounds.length));

  const handleFinishGame = () => {
    setGame((prev) => (prev ? { ...prev, finished: true } : null));

    if (gameNight && game) {
      const playerScores: { [playerId: string]: number } = {};
      players.forEach((player) => {
        playerScores[player.id] = player.currVal;
      });

      const completedGame: CompletedGame = {
        id: Math.random().toString(36).substring(2, 15),
        name: game.name,
        playerScores,
        winningCondition: game.winningCondition,
      };

      setGameNight((prev) =>
        prev
          ? {
              ...prev,
              completedGames: [...prev.completedGames, completedGame],
            }
          : null,
      );
    }
  };

  const handleResetGame = () => {
    if (!game) return;
    setPlayers(
      players.map((p) => ({ ...p, rounds: [], currVal: game.startValue })),
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: would rerender indefinitely
  useEffect(() => {
    if (!game) return;
    if (
      (game.endsAtRound && minLength === game.roundToEnd) ||
      (game.endsAtScore.ends &&
        players.some((p) => p.currVal >= Number(game.scoreToEnd)) &&
        (game.endsAtScore.sameRound
          ? players.every((p) => p.rounds.length === minLength)
          : true))
    ) {
      handleFinishGame();
    }
  }, [game, players, minLength]);

  if (!game) return;

  return (
    <Layout>
      <div className="flex flex-col items-center gap-3 px-4 pt-4 sm:px-6">
        <h1 className="font-display font-extrabold text-5xl md:text-6xl">
          {game.name}
        </h1>
        <h2 className="font-bold text-xl md:text-2xl">
          {t('state:round-number', { roundNum: minLength + 1 })}{' '}
          {game.endsAtRound
            ? t('state:rounds-to-go', {
                roundsToGo: game.roundToEnd - minLength,
              }).replace(
                'Runden',
                game.roundToEnd - minLength === 1 ? 'Runde' : 'Runden',
              )
            : null}
        </h2>
        {game.endsAtRound ? (
          <h3 className="font-semibold md:text-lg">
            {t('state:game-ends-after-round', {
              roundToEnd: game.roundToEnd,
            })}
          </h3>
        ) : null}
        {game.endsAtScore ? (
          <h3 className="font-semibold md:text-lg">
            {t('state:game-ends-at-points', {
              scoreToEnd: game.scoreToEnd,
            })}
          </h3>
        ) : null}
        <div className="flex items-center space-x-2 px-12 md:px-0">
          <Switch
            checked={enforceRounds}
            color={mainColor}
            data-test-id="enforce-rounds-switch"
            id="enforce-round"
            onCheckedChange={() => setEnforceRounds(!enforceRounds)}
          />
          <Label htmlFor="enforce-round">
            {t('state:enforce-rounds-label')}
          </Label>
        </div>

        <div className="flex items-center space-x-2 px-12 md:px-0">
          <Switch
            checked={showStats}
            color={mainColor}
            data-test-id="show-stats-switch"
            id="show-stats"
            onCheckedChange={() => setShowStats(!showStats)}
          />
          <Label htmlFor="show-stats">{t('state:show-stats')}</Label>
        </div>
        <div className="space-x-4">
          <EditGameForm />
          <QuickOverview
            gameNight={gameNight}
            gameName={game.name}
            players={players}
          />
        </div>
      </div>

      <div
        className={cn(
          'grid min-w-[80vw] grid-cols-1 gap-4',
          players.length > 4 ? 'md:grid-cols-3' : 'md:grid-cols-2',
        )}
      >
        {players
          .sort((a, b) => a.order - b.order)
          .map((p) => (
            <PlayerCard
              showStats={showStats}
              player={p}
              key={p.id}
              hasMoreRounds={enforceRounds && p.rounds.length > minLength}
            />
          ))}
      </div>
      <div className="mb-12 flex flex-row gap-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button color={mainColor} data-test-id="finish-game-button">
              {t('game:finish-game.button')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            color={mainColor}
            data-test-id="finish-game-dialog"
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{t('game:finish-game.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('game:finish-game.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('action:cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFinishGame}
                data-test-id="confirm-finish-game"
                color={mainColor}
              >
                {t('game:finish-game.button')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button data-test-id="reset-game-button" variant="secondary">
              {t('game:reset-game.button')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            color={mainColor}
            data-test-id="reset-game-dialog"
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{t('game:reset-game.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('game:reset-game.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-test-id="cancel-reset-game">
                {t('action:cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetGame}
                color={mainColor}
                data-test-id="confirm-reset-game"
              >
                {t('game:reset-game.button')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
