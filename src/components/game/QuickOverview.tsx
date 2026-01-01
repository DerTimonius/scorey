import { useAtomValue } from 'jotai/react';
import { Eye } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mainColorAtom } from '@/lib/jotai';
import type { GameNight, Player } from '@/lib/types';
import { cn, getGameNightStats } from '@/lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type QuickOverviewProps = {
  players: Player[];
  gameNight: GameNight | null;
  gameName: string;
};

export function QuickOverview({
  players,
  gameNight,
  gameName,
}: QuickOverviewProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const color = useAtomValue(mainColorAtom);

  const { sortedPlayers, maxRounds } = useMemo(() => {
    const max = Math.max(...players.map((p) => p.rounds.length));

    return {
      maxRounds: max,
      sortedPlayers: [...players].sort((a, b) => b.currVal - a.currVal),
    };
  }, [players]);

  if (players.length < 3 && !gameNight) return;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          color={color}
          aria-label={t('game:overview.title')}
        >
          <Eye className="!size-6" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" sideOffset={8} color={color}>
        {gameNight ? (
          <div className="space-y-4 px-2">
            <section>
              <h3 className="mb-3 text-center">
                {t('game:overview.game', { game: gameName })}
              </h3>
              <ol className="list-inside list-decimal space-y-1">
                {sortedPlayers.map((player) => {
                  const hasFewerRounds = player.rounds.length < maxRounds;

                  return (
                    <li
                      key={player.id}
                      className={cn(
                        'font-medium first:font-bold',
                        hasFewerRounds && 'opacity-100',
                      )}
                    >
                      <span className="inline-flex w-3/4 justify-between">
                        <span>{player.name}</span>
                        <span>{player.currVal}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
            <GameNightOverview gameNight={gameNight} />
          </div>
        ) : (
          <>
            <h3 className="mb-3 text-center">{t('game:overview.title')}</h3>
            <ol className="list-inside list-decimal space-y-1">
              {sortedPlayers.map((player) => {
                const hasFewerRounds = player.rounds.length < maxRounds;

                return (
                  <li
                    key={player.id}
                    className={cn(
                      'font-medium first:font-bold',
                      hasFewerRounds && 'opacity-100',
                    )}
                  >
                    <span className="inline-flex w-3/4 justify-between">
                      <span>{player.name}</span>
                      <span>{player.currVal}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

function GameNightOverview({ gameNight }: { gameNight: GameNight }) {
  const { t } = useTranslation();
  const sortedPlayers = getGameNightStats(gameNight);

  return (
    <section>
      <h3 className="mb-3 text-center">{t('game:overview.game-night')}</h3>
      <ol className="list-inside list-decimal space-y-1">
        {sortedPlayers.map((player) => {
          return (
            <li key={player.id} className={cn('font-medium first:font-bold')}>
              <span className="inline-flex w-3/4 justify-between">
                <span>{player.name}</span>
                <span>{player.totalPoints}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
