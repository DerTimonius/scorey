import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { DEFAULT_COLOR } from './constants';
import type { Color, Game, Player } from './types';

export const gameAtom = atomWithStorage<Game | null>('scorey.game', null);
export const playerAtom = atomWithStorage<Player[]>('scorey.players', []);
export const mainColorAtom = atomWithStorage<Color>(
  'scorey.color',
  DEFAULT_COLOR,
);
export const showGameFormAtom = atom(false);
