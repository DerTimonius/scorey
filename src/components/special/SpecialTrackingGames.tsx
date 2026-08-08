import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { trackingSpecialGameAtom } from '@/lib/jotai';
import { Layout } from '../layout/Layout';
import { Button } from '../ui/button';
import { TrackFugitive } from './games/Fugitive';

export function SpecialTrackingGames() {
  const { t } = useTranslation();
  const [specialGame, setSpecialGame] = useAtom(trackingSpecialGameAtom);

  const handleSelectSpecialGame = (game: 'fugitive') => {
    setSpecialGame(game);
  };

  if (specialGame) {
    switch (specialGame) {
      case 'fugitive':
        return <TrackFugitive />;
    }
  }

  return (
    <Layout>
      <div className="flex flex-col items-center gap-10 px-4 pt-4 sm:px-6">
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-display font-extrabold text-5xl md:text-6xl">
            {t('special:labels.title')}
          </h1>
          <section className="font-bold text-xl md:text-2xl">
            {t('specials:labels.description')}
          </section>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          <Button
            onClick={() => handleSelectSpecialGame('fugitive')}
            variant="secondary"
          >
            Fugitive
          </Button>
        </div>
      </div>
    </Layout>
  );
}
