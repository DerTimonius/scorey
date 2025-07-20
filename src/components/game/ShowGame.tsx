import { useAtom } from 'jotai/react';
import { gameAtom, playerAtom } from '@/lib/jotai';
import { cn } from '@/lib/utils';
import { PlayerCard } from '../player/PlayerCard';
import { Button } from '../ui/button';

export function ShowGame() {
  const [game, setGame] = useAtom(gameAtom);
  const [players, setPlayers] = useAtom(playerAtom);

  if (!game) return;

  const minLength = Math.min(...players.map((p) => p.rounds.length));

  const handleFinishGame = () => {
    setGame((prev) => (prev ? { ...prev, finished: true } : null));
  };

  const handleResetGame = () => {
    setPlayers(
      players.map((p) => ({ ...p, rounds: [], currVal: game.startValue })),
    );
  };

  return (
    <main className="my-4 flex min-h-screen w-screen flex-col items-center justify-center gap-18">
      <div>
        <h1 className="font-extrabold text-4xl">{game.name}</h1>
        <h2 className="font-bold text-2xl">Round {minLength + 1}</h2>
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
              hasMoreRounds={p.rounds.length > minLength}
            />
          ))}
      </div>
      <div className="flex flex-row gap-8">
        <Button onClick={handleFinishGame}>Finish game</Button>
        <Button onClick={handleResetGame} variant="neutral">
          Reset game
        </Button>
      </div>
    </main>
  );
}
