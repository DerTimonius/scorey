import { Circle, Hexagon, Plus, Square, Triangle } from 'lucide-react';
import {
  CartesianGrid,
  type DotProps,
  Legend,
  Line,
  LineChart,
  XAxis,
} from 'recharts';
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

const LucideIcons = [Circle, Triangle, Square, Hexagon, Plus];
const CustomDot = (props: DotProps & { index: number }) => {
  const { cx, cy, stroke, index } = props;

  if (cx === undefined || cy === undefined || index === undefined) {
  }

  const IconComponent = LucideIcons[index % LucideIcons.length];
  const iconSize = 10;

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <IconComponent
        size={iconSize}
        color={stroke}
        fill={stroke}
        y={-iconSize / 2}
        x={-iconSize / 2}
      />
    </g>
  );
};
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
              tickFormatter={(value: string) => `Round ${value}`}
            />
            <Legend iconType="plainline" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelKey="round" />}
            />
            {players.map((player, idx) => {
              return (
                <Line
                  dataKey={player.name}
                  key={player.name}
                  type="monotone"
                  stroke={`var(--chart-${player.color})`}
                  strokeWidth={2}
                  dot={(props) => <CustomDot {...props} index={idx} />}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
