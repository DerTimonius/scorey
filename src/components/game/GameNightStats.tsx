import { useAtomValue } from 'jotai/react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { easeOut } from '@/lib/animations';
import { gameAtom, gameNightAtom, mainColorAtom } from '@/lib/jotai';
import { cn, getGameNightStats } from '@/lib/utils';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function GameNightStats() {
  const { t } = useTranslation();
  const mainColor = useAtomValue(mainColorAtom);
  const game = useAtomValue(gameAtom);
  const gameNight = useAtomValue(gameNightAtom);

  const motionVariants = {
    offscreen: {
      scale: 0.5,
      opacity: 0.5,
    },
    onscreen: {
      scale: 1,
      opacity: 1,
      transition: easeOut,
    },
  };

  const sortedPlayers = getGameNightStats(gameNight);

  if (!game || !gameNight) return null;

  return (
    <motion.div
      variants={motionVariants}
      initial="offscreen"
      whileInView="onscreen"
    >
      <Card
        className="my-8 w-[80vw]"
        color={mainColor}
        data-test-id="game-night-stats"
      >
        <CardHeader>
          <CardTitle
            className="text-center font-display text-3xl md:text-4xl"
            data-test-id="game-night-title"
          >
            {t('game:game-night.total-ranking')}
          </CardTitle>
          <CardDescription className="text-center text-lg">
            {t('game:game-night.games-played', {
              count: gameNight.completedGames.length,
            })}
          </CardDescription>
        </CardHeader>
        <div
          className={cn(
            'flex flex-col items-center justify-around gap-4 px-6 py-4',
          )}
        >
          <h3 className="mb-2 text-center font-bold text-2xl">
            {t('game:game-night.total-points')}
          </h3>
          <motion.ol
            className="w-full list-inside list-decimal space-y-3 px-12"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            {sortedPlayers.map((player, idx) => (
              <motion.li
                key={player.id}
                className={cn(
                  'grid grid-cols-[2fr_1fr_1fr] rounded-lg bg-opacity-20 p-3 first:font-bold',
                )}
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: 0.5 + 0.1 * idx,
                }}
              >
                <span className="flex items-center gap-3">{player.name}</span>
                <p className="font-semibold">
                  <span className="font-light text-sm">
                    {t('state:current-score')}:
                  </span>{' '}
                  {player.totalPoints}
                </p>
                <p>
                  <span className="font-light text-sm">
                    {t('game:game-night.wins')}:
                  </span>{' '}
                  {player.wins}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Card>
    </motion.div>
  );
}
