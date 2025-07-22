import { useTranslation } from 'react-i18next';
import { CartesianGrid, Legend, Line, LineChart, XAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface GameChartDataItem {
  round: string;
  [player: string]: number | string;
}

interface GameChartProps {
  containerClasses?: string;
  data: GameChartDataItem[];
  players: Player[];
  chartConfig: ChartConfig;
}

export function GameChart({
  data,
  players,
  chartConfig,
  containerClasses,
}: GameChartProps) {
  const { t } = useTranslation();
  if (!data.length || !players.length) return;

  return (
    <Card className="bg-secondary-background text-foreground">
      <CardContent>
        <ChartContainer
          className={cn('min-w-2xl ', containerClasses)}
          config={chartConfig}
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="round"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) =>
                t('game:state.round-number', { roundNum: value })
              }
            />
            <Legend iconType="plainline" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelKey="round" />}
            />
            {players.map((player) => {
              return (
                <Line
                  dataKey={player.name}
                  key={player.name}
                  type="monotone"
                  stroke={`var(--chart-${player.color})`}
                  strokeWidth={2}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
