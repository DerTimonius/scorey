import './index.css';
import { useAtomValue } from 'jotai/react';
import { GameForm } from './components/game/GameForm';
import { GameStats } from './components/game/GameStats';
import { GameState } from './components/game/GameState';
import { gameAtom } from './lib/jotai';

function App() {
  const game = useAtomValue(gameAtom);

  if (game) {
    return game.finished ? <GameStats /> : <GameState />;
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-18">
      <div>
        <h1 className="font-bold text-8xl">Scorey</h1>
        <p>Keep score of any game</p>
      </div>
      <GameForm />
    </main>
  );
}

export default App;
