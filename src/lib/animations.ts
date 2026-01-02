import type { MotionProps } from 'motion/react';

export const easeOut = {
  ease: [0.232, 0.701, 0, 0.9],
  duration: 0.35,
} satisfies MotionProps['transition'];

export const easeIn = {
  ease: [1, 0, 0.5, 0.5],
  duration: 0.35,
} satisfies MotionProps['transition'];

export const fastEaseOut = {
  ease: [0.004, 0.998, 0, 0.973],
  duration: 0.35,
} satisfies MotionProps['transition'];

export const fastEaseIn = {
  duration: 0.35,
  ease: [1, 0.15, 0.77, 0.179],
} satisfies MotionProps['transition'];

export const playerFormAnimation = (_reduceMotion: boolean | null) =>
  ({
    initial: { scale: 0.4, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: fastEaseOut,
    exit: {
      opacity: 0,
      x: '100%',
      transition: fastEaseIn,
    },
  }) satisfies MotionProps;
