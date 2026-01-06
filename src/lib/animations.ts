import type { MotionProps } from 'motion/react';

const DURATION = 0.35;

export const easeOut = {
  ease: [0.232, 0.701, 0, 0.9],
  duration: DURATION,
} satisfies MotionProps['transition'];

export const easeIn = {
  ease: [1, 0, 0.5, 0.5],
  duration: DURATION,
} satisfies MotionProps['transition'];

export const fastEaseOut = {
  ease: [0.004, 0.998, 0, 0.973],
  duration: DURATION,
} satisfies MotionProps['transition'];

export const fastEaseIn = {
  duration: DURATION,
  ease: [1, 0.15, 0.77, 0.179],
} satisfies MotionProps['transition'];

export const bounce = {
  duration: DURATION,
  type: 'spring',
  stiffness: 26,
  damping: 13,
  mass: 2.2,
} satisfies MotionProps['transition'];

export const playerFormAnimation = (reduceMotion: boolean | null) =>
  ({
    initial: { scale: 0.4, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: fastEaseOut,
    exit: {
      opacity: 0,
      x: reduceMotion ? 0 : '100%',
      transition: fastEaseIn,
    },
  }) satisfies MotionProps;
