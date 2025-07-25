import { useAtom } from 'jotai/react';
import { useTranslation } from 'react-i18next';
import { getMainFromColor } from '@/lib/colorHelper';
import { gameAtom, mainColorAtom } from '@/lib/jotai';
import { type Color, colorsArray } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function Navbar() {
  const [mainColor, setMainColor] = useAtom(mainColorAtom);
  const [game, setGame] = useAtom(gameAtom);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: 'de' | 'en') => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav
      className={cn(
        'flex h-16 flex-row items-center justify-around border-border border-b-2',
        getMainFromColor(mainColor),
      )}
    >
      {game?.finished ? (
        <button
          type="button"
          onClick={() => setGame(null)}
          className="cursor-pointer font-display font-extrabold text-4xl"
        >
          Scorey
        </button>
      ) : (
        <p className="font-display font-extrabold text-4xl">Scorey</p>
      )}
      <div className="flex gap-4">
        <Button onClick={() => changeLanguage('de')} variant="tertiary">
          DE
        </Button>
        <Button onClick={() => changeLanguage('en')} variant="tertiary">
          EN
        </Button>
        <Select
          onValueChange={(val) => setMainColor(val as Color)}
          defaultValue={mainColor}
        >
          <SelectTrigger className="w-16">
            <SelectValue
              className="capitalize"
              placeholder={t('color:select-color')}
            >
              <span
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  getMainFromColor(mainColor),
                )}
              ></span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {colorsArray.map((color) => (
              <SelectItem key={color} className="capitalize" value={color}>
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    getMainFromColor(color),
                  )}
                ></span>
                {t(`color:${color}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
}
