import type { Player } from '@/lib/types';
import { PlayerChart } from '../charts/PlayerChart';
import type { ChartConfig } from '../ui/chart';

interface PlayerStatsProps {
  player: Player;
}

export function PlayerStats({
  player: { rounds, name, color },
}: PlayerStatsProps) {
  const chartData = rounds.map((round, idx) => ({
    round: (idx + 1).toString(),
    val: round,
  }));

  const chartConfig = {
    [name]: {
      label: 'val',
      color: `var(--chart-${color})`,
    },
  } satisfies ChartConfig;

  return (
    <PlayerChart
      chartConfig={chartConfig}
      color={color}
      label={`Rounds for ${name}`}
      data={chartData}
    />
  );
}
