import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { bounce } from '@/lib/animations';

export function AnimatedName({ children }: React.PropsWithChildren) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1.2, opacity: 1, y: 0 }}
      transition={{
        ...bounce,
        delay: 0.5,
        duration: 1,
      }}
    >
      {children}
    </motion.span>
  );
}

export function AnimatedScore({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 50,
    damping: 20,
  });
  const rounded = useTransform(springValue, (v) => Math.round(v));

  useEffect(() => {
    const timer = setTimeout(() => {
      motionValue.set(value);
    }, 1500);
    return () => clearTimeout(timer);
  }, [value, motionValue]);

  return (
    <motion.span
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1.2, opacity: 1, y: 0 }}
      transition={{
        delay: 1,
        duration: 1,
      }}
    >
      <motion.span>{rounded}</motion.span>
    </motion.span>
  );
}
