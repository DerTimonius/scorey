import { useSetAtom } from 'jotai/react';
import { useTranslation } from 'react-i18next';
import {
  gameNightAtom,
  showGameFormAtom,
  showGameNightFormAtom,
  showSpecialTrackingAtom,
} from '@/lib/jotai';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function ModeSelector() {
  const { t } = useTranslation();
  const setShowForm = useSetAtom(showGameFormAtom);
  const setShowGameNightForm = useSetAtom(showGameNightFormAtom);
  const setGameNight = useSetAtom(gameNightAtom);
  const setSpecialTracking = useSetAtom(showSpecialTrackingAtom);

  const handleSingleGame = () => {
    setGameNight(null);
    setShowForm(true);
  };

  const handleGameNight = () => {
    setShowGameNightForm(true);
  };

  const handleSpecialTracking = () => {
    setSpecialTracking(true);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold font-display text-8xl">Scorey</h1>
        <p data-test-id="tagline">{t('game:tagline')}</p>
      </div>
      <div className="flex flex-col gap-6">
        <Card
          className="w-96 cursor-pointer transition-all hover:scale-105"
          color="blue"
          onClick={handleSingleGame}
          data-test-id="single-game-mode"
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {t('game:mode-selector.single-game')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('game:mode-selector.single-game-desc')}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card
          className="w-96 cursor-pointer transition-all hover:scale-105"
          color="purple"
          onClick={handleGameNight}
          data-test-id="game-night-mode"
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {t('game:mode-selector.game-night')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('game:mode-selector.game-night-desc')}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card
          className="w-96 cursor-pointer transition-all hover:scale-105"
          color="lime"
          onClick={handleSpecialTracking}
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {t('special:labels:title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('special:labels:description')}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
