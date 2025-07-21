import { useAtom } from 'jotai/react';
import { useEffect, useState } from 'react';
import { gameAtom, playerAtom } from '@/lib/jotai';
import { cn } from '@/lib/utils';
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

export function GameState() {
  const [game, setGame] = useAtom(gameAtom);
  const [players, setPlayers] = useAtom(playerAtom);
  const [enforceRounds, setEnforceRounds] = useState(true);

  const minLength = Math.min(...players.map((p) => p.rounds.length));

  const handleFinishGame = () => {
    setGame((prev) => (prev ? { ...prev, finished: true } : null));
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
      (game.endsAtScore &&
        players.some((p) => p.currVal >= Number(game.scoreToEnd)))
    ) {
      handleFinishGame();
    }
  }, [game, players, minLength]);

  if (!game) return;

  return (
    <main className="my-4 flex min-h-screen w-screen flex-col items-center justify-center gap-18">
      <div>
        <h1 className="font-extrabold text-4xl">{game.name}</h1>
        <h2 className="font-bold text-2xl">
          Round {minLength + 1}
          {game.endsAtRound
            ? ` (${game.roundToEnd - minLength} rounds to go)`
            : null}
        </h2>
        {game.endsAtRound ? (
          <h3 className="font-semibold text-xl">
            Game ends after round {game.roundToEnd}
          </h3>
        ) : null}
        {game.endsAtScore ? (
          <h3 className="font-semibold text-xl">
            Game ends after a player reaches {game.scoreToEnd} points
          </h3>
        ) : null}
        <div className="flex items-center space-x-2">
          <Switch
            id="enforce-round"
            onCheckedChange={() => setEnforceRounds(!enforceRounds)}
            checked={enforceRounds}
          />
          <Label htmlFor="enforce-round">
            Only play when every player is on the same round
          </Label>
        </div>
      </div>

      <div
        className={cn(
          'grid min-w-[80vw] gap-4',
          players.length > 4 ? 'grid-cols-3' : 'grid-cols-2',
        )}
      >
        {players
          .sort((a, b) => a.order - b.order)
          .map((p) => (
            <PlayerCard
              player={p}
              key={p.id}
              hasMoreRounds={enforceRounds && p.rounds.length > minLength}
            />
          ))}
      </div>
      <div className="flex flex-row gap-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Finish game</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Did everyone finish the game? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleFinishGame}>
                Finish game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">Reset game</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure, you want to reset this game?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={handleResetGame}>Reset game</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
