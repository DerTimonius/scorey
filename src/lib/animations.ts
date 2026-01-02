import type { MotionProps } from 'motion/react';

export const playerFormAnimation = (reduceMotion: boolean | null) =>
  ({
    initial: { scale: 0.4, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      ease: [0.004, 0.998, 0, 0.973],
      duration: 0.35,
    },
    exit: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.35,
        ease: [1, 0.15, 0.77, 0.179],
      },
    },
  }) satisfies MotionProps;
