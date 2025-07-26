import { useTranslation } from 'react-i18next';
import type { Player } from '@/lib/types';
import { PlayerChart } from '../charts/PlayerChart';
import type { ChartConfig } from '../ui/chart';

interface PlayerStatsProps {
  player: Player;
}

export function PlayerStats({
  player: { rounds, name, color },
}: PlayerStatsProps) {
  const { t } = useTranslation();
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
      dataTestId={`player-chart-${name}`}
      chartConfig={chartConfig}
      color={color}
      label={t('game:player-stats', { name })}
      data={chartData}
    />
  );
}
