import './index.css';
import { useAtomValue } from 'jotai/react';
import { GameForm } from './components/game/GameForm';
import { GameNightForm } from './components/game/GameNightForm';
import { GameNightGameForm } from './components/game/GameNightGameForm';
import { GameNightOverview } from './components/game/GameNightOverview';
import { GameState } from './components/game/GameState';
import { GameStats } from './components/game/GameStats';
import { ModeSelector } from './components/game/ModeSelector';
import { Layout } from './components/layout/Layout';
import {
  gameAtom,
  gameNightAtom,
  showGameFormAtom,
  showGameNightFormAtom,
} from './lib/jotai';

function App() {
  const game = useAtomValue(gameAtom);
  const gameNight = useAtomValue(gameNightAtom);
  const showForm = useAtomValue(showGameFormAtom);
  const showGameNightForm = useAtomValue(showGameNightFormAtom);

  if (game) {
    return game.finished ? <GameStats /> : <GameState />;
  }

  if (showGameNightForm) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-8">
          <GameNightForm />
        </div>
      </Layout>
    );
  }

  if (showForm) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-8">
          <GameForm />
        </div>
      </Layout>
    );
  }

  if (gameNight) {
    if (gameNight.isFinished) {
      return <GameNightOverview />;
    }
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-8">
          <GameNightGameForm />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ModeSelector />
    </Layout>
  );
}

export default App;
