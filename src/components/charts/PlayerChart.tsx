import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import type { Color } from '@/lib/types';

interface PlayerChartProps {
  label: string;
  data: { round: string; val: number }[];
  chartConfig: ChartConfig;
  color: Color;
}

export function PlayerChart({
  label,
  data,
  chartConfig,
  color,
}: PlayerChartProps) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  return (
    <Card className="w-full bg-secondary-background text-foreground">
      <CardHeader>
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 40,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="round"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) =>
                t('state:round-number', { roundNum: value })
              }
            />
            {!isMobile ? <YAxis /> : null}
            <Bar dataKey="val" fill={`var(--chart-${color})`} radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
