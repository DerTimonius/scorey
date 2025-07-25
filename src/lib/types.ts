import z from 'zod';

const winningConditions = ['minNumber', 'maxNumber'] as const;

export const WinningConditionEnum = z.enum(winningConditions);
export type WinningCondition = z.infer<typeof WinningConditionEnum>;

export interface Player {
  id: string;
  order: number;
  name: string;
  rounds: number[];
  currVal: number;
  color: Color;
}

export interface Game {
  name: string;
  finished?: boolean;
  winningCondition: WinningCondition;
  startValue: number;
  endsAtScore: {
    ends: boolean;
    sameRound: boolean;
  };
  scoreToEnd: number;
  endsAtRound: boolean;
  roundToEnd: number;
}

export const colorsArray = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const;

export const ColorEnum = z.enum(colorsArray);
export type Color = z.infer<typeof ColorEnum>;

export type VariantType<T extends string> = Record<T, string>;
export type VariantColor = VariantType<Color>;
