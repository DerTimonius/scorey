import { useAtomValue } from 'jotai/react';
import { useTranslation } from 'react-i18next';
import { mainColorAtom } from '@/lib/jotai';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface CommonProps {
  handleNewGame: () => void;
  handleNewRound: () => void;
}

interface SingleGameButtonsProps extends CommonProps {
  handleKeepPlayers: () => void;
}

export function SingleGameButtons({
  handleNewGame,
  handleNewRound,
  handleKeepPlayers,
}: SingleGameButtonsProps) {
  const mainColor = useAtomValue(mainColorAtom);
  const { t } = useTranslation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button data-test-id="new-game-button" color={mainColor}>
          {t('game:new-game.button')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent color={mainColor} data-test-id="new-game-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('game:new-game.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('game:new-game.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-3 sm:flex-col">
          <AlertDialogAction
            onClick={handleNewGame}
            color={mainColor}
            data-test-id="confirm-new-game"
          >
            {t('game:new-game.all-new')}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleNewRound}
            color={mainColor}
            data-test-id="confirm-new-round"
          >
            {t('game:new-game.new-round')}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleKeepPlayers}
            color={mainColor}
            data-test-id="confirm-keep-players"
          >
            {t('game:new-game.keep-players')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface GameNightButtonsProps extends CommonProps {
  handleFinishGameNight: () => void;
}

export function GameNightButtons({
  handleNewGame,
  handleFinishGameNight,
  handleNewRound,
}: GameNightButtonsProps) {
  const mainColor = useAtomValue(mainColorAtom);
  const { t } = useTranslation();

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button data-test-id="next-game-button" color={mainColor}>
            {t('game:game-night.next-game')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent color={mainColor} data-test-id="next-game-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('game:new-game.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('game:new-game.game-night-description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3 sm:flex-col">
            <AlertDialogAction
              onClick={handleNewGame}
              color={mainColor}
              data-test-id="confirm-next-game"
            >
              {t('game:new-game.keep-players').replace(/,.*/, '')}
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handleNewRound}
              color={mainColor}
              data-test-id="confirm-new-round"
            >
              {t('game:new-game.new-round')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button data-test-id="finish-game-night-button" variant="secondary">
            {t('game:game-night.finish-game-night')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          color={mainColor}
          data-test-id="finish-game-night-dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('game:game-night.final-results')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3 sm:flex-col">
            <AlertDialogAction
              onClick={handleFinishGameNight}
              color={mainColor}
              data-test-id="confirm-finish-game-night"
            >
              {t('game:game-night.finish-game-night')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
