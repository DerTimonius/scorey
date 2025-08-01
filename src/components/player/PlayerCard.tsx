import NumberFlow from '@number-flow/react';
import { useSetAtom } from 'jotai/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { playerAtom } from '@/lib/jotai';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { PlayerStats } from './PlayerStats';

interface PlayerCardProps {
  player: Player;
  hasMoreRounds: boolean;
  showStats: boolean;
}

export function PlayerCard({
  player,
  hasMoreRounds,
  showStats,
}: PlayerCardProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState<number>();
  const [type, setType] = useState<'increase' | 'descrease'>();
  const inputRef = useRef<HTMLInputElement>(null);
  const setPlayers = useSetAtom(playerAtom);

  const increasePlayerVal = (amount: number) => {
    const newVal = player.currVal + amount;
    const rounds = [...player.rounds, amount];

    setPlayers((prev) => [
      ...prev.filter((p) => p.id !== player.id),
      { ...player, rounds, currVal: newVal },
    ]);
  };

  const decreasePlayerVal = (amount: number) => {
    const newVal = player.currVal - amount;
    const rounds = [...player.rounds, amount * -1];

    setPlayers((prev) => [
      ...prev.filter((p) => p.id !== player.id),
      { ...player, rounds, currVal: newVal },
    ]);
  };

  const handleSubmit = () => {
    setType(undefined);
    const func = type === 'increase' ? increasePlayerVal : decreasePlayerVal;
    func(value ?? 0);
    setValue(undefined);
  };

  useLayoutEffect(() => {
    if (type && inputRef.current) {
      inputRef.current.focus();
    }
  }, [type]);

  return (
    <Card
      color={player.color}
      className="gap-2 md:gap-6"
      data-test-id={`player-card-${player.name}`}
    >
      <CardHeader>
        <CardTitle className="text-center text-2xl">{player.name}</CardTitle>
      </CardHeader>
      <div
        className={cn('flex flex-col items-center justify-around gap-2 px-3')}
      >
        <div className="flex flex-col items-center">
          <p className="font-semibold">{t('state:current-score')}</p>
          <NumberFlow
            className="font-extrabold text-4xl"
            data-test-id={`current-score-${player.name}`}
            value={player.currVal}
          />
        </div>
        {type ? (
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="value" className="capitalize">
              {t(type === 'increase' ? 'game:increase-by' : 'game:decrease-by')}
            </label>
            <div className="flex items-center justify-between px-2">
              <input
                className="w-32 text-center font-extrabold text-4xl"
                id="value"
                data-test-id="score-input"
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(Number.parseInt(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                type="number"
              />
              <Button
                color={player.color}
                onClick={handleSubmit}
                variant="ghost"
              >
                {t('action:save')}
              </Button>
              <Button
                className="ml-2"
                color={player.color}
                onClick={() => setType(undefined)}
                variant="tertiary"
              >
                {t('action:cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-around gap-2 md:gap-6">
            <Button
              color={player.color}
              data-test-id={`minus-button-${player.name}`}
              disabled={hasMoreRounds}
              onClick={() => {
                setType('descrease');
              }}
              variant="ghost"
            >
              -
            </Button>
            <Button
              color={player.color}
              data-test-id={`plus-button-${player.name}`}
              disabled={hasMoreRounds}
              onClick={() => {
                setType('increase');
              }}
              variant="ghost"
            >
              +
            </Button>
            <Button
              className="max-w-max"
              color={player.color}
              data-test-id={`skip-round-button-${player.name}`}
              disabled={hasMoreRounds}
              onClick={() => {
                increasePlayerVal(0);
              }}
              variant="ghost"
            >
              {t('state:skip-round')}
            </Button>
          </div>
        )}
      </div>
      <CardFooter>
        {showStats && player.rounds.length ? (
          <PlayerStats player={player} />
        ) : null}
      </CardFooter>
    </Card>
  );
}
