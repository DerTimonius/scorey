import NumberFlow from '@number-flow/react';
import { useSetAtom } from 'jotai/react';
import { Pen } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { playerAtom } from '@/lib/jotai';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card, CardFooter, CardHeader, } from '../ui/card';
import { Input } from '../ui/input';
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
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(player.name);
  const [value, setValue] = useState<number>();
  const [type, setType] = useState<'increase' | 'descrease'>();
  const inputRef = useRef<HTMLInputElement>(null);
  const setPlayers = useSetAtom(playerAtom);

  const handleUpdateName = () => {
    setPlayers((prev) => [
      ...prev.filter((p) => p.id !== player.id),
      { ...player, name },
    ]);
    setIsEditing(false);
  };

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

  const handleUndo = () => {
    const rounds = player.rounds.slice(0, player.rounds.length - 1);
    const currVal = rounds.reduce((acc, val) => acc + val, 0);

    setPlayers((prev) => [
      ...prev.filter((p) => p.id !== player.id),
      { ...player, rounds, currVal },
    ]);
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
        <div
          data-slot="card-title"
          className="ap-2 grid grid-cols-3 font-heading text-2xl leading-none"
        >
          {/* If in edit mode, show input; otherwise show player name */}
          {isEditing ? (
            <>
              <Input
                className="col-start-2 w-48 place-self-center self-center text-center font-extrabold text-2xl"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleUpdateName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateName();
                  } else if (e.key === 'Escape') {
                    setIsEditing(false);
                  }
                }}
                autoFocus
              />
              <Button
                className="max-w-min self-center text-sm"
                color={player.color}
                onClick={handleUpdateName}
                size="sm"
                variant="ghost"
              >
                {t('action:save')}
              </Button>
            </>
          ) : (
            <>
              <div className="col-start-2 place-self-center self-center">
                {player.name}
              </div>
              <Button
                color={player.color}
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="max-w-min"
              >
                <Pen aria-hidden />
                <span className="sr-only">
                  {t('form:player-name.edit', { name: player.name })}
                </span>
              </Button>
            </>
          )}
        </div>
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
              <Input
                className="w-32 text-center font-extrabold text-4xl"
                id="value"
                data-test-id="score-input"
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(Number.parseInt(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  } else if (e.key === 'Escape') {
                    setType(undefined);
                  }
                }}
                type="number"
                autoFocus
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
          <div className="flex w-full flex-col items-center gap-4">
            <PlayerStats player={player} />
            <Button
              className="max-w-max"
              color={player.color}
              onClick={handleUndo}
              variant="ghost"
            >
              {t('state:undo-round')}
            </Button>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
}
