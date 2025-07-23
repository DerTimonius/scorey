import type { Color } from './types';

export const getMainFromColor = (color: Color) => {
  switch (color) {
    case 'red':
      return 'bg-red-main';
    case 'orange':
      return 'bg-orange-main';
    case 'amber':
      return 'bg-amber-main';
    case 'yellow':
      return 'bg-yellow-main';
    case 'lime':
      return 'bg-lime-main';
    case 'green':
      return 'bg-green-main';
    case 'emerald':
      return 'bg-emerald-main';
    case 'teal':
      return 'bg-teal-main';
    case 'cyan':
      return 'bg-cyan-main';
    case 'sky':
      return 'bg-sky-main';
    case 'blue':
      return 'bg-blue-main';
    case 'indigo':
      return 'bg-indigo-main';
    case 'violet':
      return 'bg-violet-main';
    case 'purple':
      return 'bg-purple-main';
    case 'fuchsia':
      return 'bg-fuchsia-main';
    case 'pink':
      return 'bg-pink-main';
    case 'rose':
      return 'bg-rose-main';
  }
};

export const getBgFromColor = (color: Color) => {
  switch (color) {
    case 'red':
      return 'bg-red-background';
    case 'orange':
      return 'bg-orange-background';
    case 'amber':
      return 'bg-amber-background';
    case 'yellow':
      return 'bg-yellow-background';
    case 'lime':
      return 'bg-lime-background';
    case 'green':
      return 'bg-green-background';
    case 'emerald':
      return 'bg-emerald-background';
    case 'teal':
      return 'bg-teal-background';
    case 'cyan':
      return 'bg-cyan-background';
    case 'sky':
      return 'bg-sky-background';
    case 'blue':
      return 'bg-blue-background';
    case 'indigo':
      return 'bg-indigo-background';
    case 'violet':
      return 'bg-violet-background';
    case 'purple':
      return 'bg-purple-background';
    case 'fuchsia':
      return 'bg-fuchsia-background';
    case 'pink':
      return 'bg-pink-background';
    case 'rose':
      return 'bg-rose-background';
  }
};
