import './index.css';
import { useAtomValue } from 'jotai/react';
import { useTranslation } from 'react-i18next';
import { GameForm } from './components/game/GameForm';
import { GameState } from './components/game/GameState';
import { GameStats } from './components/game/GameStats';
import { Layout } from './components/layout/Layout';
import { gameAtom } from './lib/jotai';

function App() {
  const { t } = useTranslation();
  const game = useAtomValue(gameAtom);

  if (game) {
    return game.finished ? <GameStats /> : <GameState />;
  }

  return (
    <Layout>
      <div>
        <h1 className="font-bold text-8xl">Scorey</h1>
        <p>{t('game:tagline')}</p>
      </div>
      <GameForm />
    </Layout>
  );
}

export default App;
