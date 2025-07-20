import { atomWithStorage } from 'jotai/utils';
import type { Game, Player } from './types';

export const gameAtom = atomWithStorage<Game | null>('scorey.game', null);
export const playerAtom = atomWithStorage<Player[]>('scorey.players', []);
