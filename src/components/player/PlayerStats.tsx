import type { Player } from '@/lib/types';
import { PlayerChart } from '../charts/PlayerChart';

interface PlayerStatsProps {
  player: Player;
}

export function PlayerStats({ player: { rounds, name } }: PlayerStatsProps) {
  const chartData = rounds.map((round, idx) => ({
    round: (idx + 1).toString(),
    val: round,
  }));

  return <PlayerChart label={`Rounds for ${name}`} data={chartData} />;
}
