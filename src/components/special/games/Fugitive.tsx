import { useSetAtom } from 'jotai';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { trackingSpecialGameAtom } from '@/lib/jotai';
import { cn } from '@/lib/utils';

export function TrackFugitive() {
  const { t } = useTranslation();
  const setSpecialGame = useSetAtom(trackingSpecialGameAtom);

  const finishGame = () => setSpecialGame(undefined);

  return (
    <Layout>
      <div className="flex flex-col items-center gap-10 px-4 pt-4 sm:px-6">
        <h1 className="font-display font-extrabold text-5xl md:text-6xl">
          Fugitive
        </h1>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-6">
          {Array.from({ length: 42 }).map((_, idx) => (
            <FugitiveButton
              // biome-ignore lint/suspicious/noArrayIndexKey: save
              key={`fugitive-no-${idx}`}
              label={String(idx + 1)}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <Button onClick={finishGame}>{t('game:finish-game.button')}</Button>
        </div>
      </div>
    </Layout>
  );
}

type FugitiveButtonState =
  | 'not-sure'
  | 'hideout'
  | 'no-hideout'
  | 'no-knowledge';
function FugitiveButton({ label }: { label: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<FugitiveButtonState>('no-knowledge');

  const options = [
    'hideout',
    'no-hideout',
    'not-sure',
    'no-knowledge',
  ] satisfies FugitiveButtonState[];

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            state === 'hideout'
              ? 'bg-green-300!'
              : state === 'no-hideout'
                ? 'bg-red-400!'
                : state === 'not-sure' && 'bg-orange-300!',
          )}
          variant="tertiary"
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-max space-y-3">
        {t('special:fugitive.is-hideout', { label })}
        {options.map((opt) => (
          <Button
            key={opt}
            onClick={() => {
              setState(opt);
              setOpen(false);
            }}
            variant={opt === state ? 'primary' : 'secondary'}
            className="flex w-full min-w-min justify-between"
          >
            {t(`special:fugitive.${opt}`)}
            {opt === state ? <Check /> : null}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
