import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { bounce, easeOut } from '@/lib/animations';

type WinnerMessageProps = {
  winnerName: string;
  score: number;
};

export function WinnerMessage({ winnerName, score }: WinnerMessageProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...easeOut, delay: 0.4 }}
      >
        {t('game:game-stats.winner-and')}
      </motion.span>
      <span> </span>
      <motion.span
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...easeOut, delay: 1.0 }}
      >
        {t('game:game-stats.winner-with')}
      </motion.span>
      <span> </span>
      <AnimatedPoints score={score} />
      <span> </span>
      <motion.span
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...easeOut, delay: 2.2 }}
      >
        {t('game:game-stats.winner-points')}
      </motion.span>
      <span> </span>
      <motion.span
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...easeOut, delay: 2.8 }}
      >
        {t('game:game-stats.winner-is')}
      </motion.span>
      <span> </span>
      <motion.span
        className="font-bold text-6xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...bounce, delay: 3.4 }}
      >
        {winnerName}
      </motion.span>
    </div>
  );
}

function AnimatedPoints({ score }: { score: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 50,
    damping: 20,
  });
  const rounded = useTransform(springValue, (v) => Math.round(v));

  useEffect(() => {
    const timer = setTimeout(() => {
      motionValue.set(score);
    }, 1400);
    return () => clearTimeout(timer);
  }, [score, motionValue]);

  return (
    <motion.span
      className="font-bold text-6xl"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...bounce, delay: 1.6 }}
    >
      <motion.span>{rounded}</motion.span>
    </motion.span>
  );
}
