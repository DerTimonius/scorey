import * as v from 'valibot';

const winningConditions = ['minNumber', 'maxNumber'] as const;

export const WinningConditionEnum = v.picklist(winningConditions);
export type WinningCondition = (typeof winningConditions)[number];

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

const scoringModes = ['winner-only', 'game-points', 'ranked'] as const;

export const ScoringModeEnum = v.picklist(scoringModes);
export type ScoringMode = (typeof scoringModes)[number];

export interface CompletedGame {
  id: string;
  name: string;
  playerScores: { [playerId: string]: number };
  winningCondition: WinningCondition;
}

export interface GameNight {
  players: Player[];
  scoringMode: ScoringMode;
  completedGames: CompletedGame[];
  isFinished: boolean;
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

export const ColorEnum = v.picklist(colorsArray);
export type Color = (typeof colorsArray)[number];

export type VariantType<T extends string> = Record<T, string>;
export type VariantColor = VariantType<Color>;
