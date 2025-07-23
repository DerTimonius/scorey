import './index.css';
import { useAtomValue } from 'jotai/react';
import { GameForm } from './components/game/GameForm';
import { GameState } from './components/game/GameState';
import { GameStats } from './components/game/GameStats';
import { Layout } from './components/layout/Layout';
import { gameAtom } from './lib/jotai';

function App() {
  const game = useAtomValue(gameAtom);

  if (game) {
    return game.finished ? <GameStats /> : <GameState />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-8">
        <GameForm />
      </div>
    </Layout>
  );
}

export default App;
