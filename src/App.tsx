import './index.css';
import { StartGame } from './components/StartGame';

function App() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-18">
      <h1 className="font-bold text-8xl">Scorey</h1>
      <StartGame />
    </main>
  );
}

export default App;
