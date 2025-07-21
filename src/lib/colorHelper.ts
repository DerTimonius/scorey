import type { Color } from './types';

export const getBgFromColor = (color: Color) => {
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
