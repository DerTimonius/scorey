import './index.css';
import { useAtomValue } from 'jotai/react';
import { GameStats } from './components/game/GameStats';
import { ShowGame } from './components/game/ShowGame';
import { StartGame } from './components/game/StartGame';
import { gameAtom } from './lib/jotai';

function App() {
  const game = useAtomValue(gameAtom);

  if (game) {
    return game.finished ? <GameStats /> : <ShowGame />;
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-18">
      <div>
        <h1 className="font-bold text-8xl">Scorey</h1>
        <p>Keep score of any game</p>
      </div>
      <StartGame />
    </main>
  );
}

export default App;
