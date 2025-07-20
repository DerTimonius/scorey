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
  if (!data.length || !players.length) return;

  return (
    <Card className="bg-secondary-background text-foreground">
      <CardContent>
        <ChartContainer
          className={cn(
            'min-w-2xl [&_.recharts-layer_path]:stroke-black [&_.recharts-layer_path]:dark:stroke-white',
            containerClasses,
          )}
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
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <Legend />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {players.map((player) => {
              return (
                <Line
                  dataKey={player.name}
                  key={player.name}
                  type="monotone"
                  strokeWidth={2}
                  dot={true}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
