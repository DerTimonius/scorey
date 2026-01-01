import { valibotResolver } from '@hookform/resolvers/valibot';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { Info, TrashIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as v from 'valibot';
import { getMainFromColor } from '@/lib/colorHelper';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import {
  gameAtom,
  gameNightAtom,
  mainColorAtom,
  playerAtom,
  showGameNightFormAtom,
} from '@/lib/jotai';
import {
  ColorEnum,
  colorsArray,
  type Player,
  ScoringModeEnum,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card, CardAction, CardHeader, CardTitle } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const playerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'form:player-name.required')),
  color: ColorEnum,
});

export function GameNightForm() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [showForm, setShowForm] = useAtom(showGameNightFormAtom);
  const [players, setPlayers] = useAtom(playerAtom);
  const mainColor = useAtomValue(mainColorAtom);
  const setGame = useSetAtom(gameAtom);
  const setGameNight = useSetAtom(gameNightAtom);

  const formSchema = v.object({
    players: v.pipe(
      v.array(playerSchema),
      v.minLength(1, t('form:at-least-one-player-required')),
    ),
    scoringMode: ScoringModeEnum,
  });

  const form = useForm({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      players: players.length
        ? players.map(({ name, color }) => ({ name, color }))
        : [{ name: '', color: mainColor }],
      scoringMode: 'winner-only' as const,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'players',
  });

  function onSubmit(values: v.InferOutput<typeof formSchema>) {
    const { players, scoringMode } = values;

    const playerArr = players.map((p, idx) => ({
      ...p,
      order: idx,
      id: Math.random().toString(36).substring(2, 15),
      rounds: [],
      currVal: 0,
    })) satisfies Player[];
    setPlayers(playerArr);

    setGameNight({
      players: playerArr,
      scoringMode,
      completedGames: [],
      isFinished: false,
    });

    setGame(null);
    setShowForm(false);
  }

  if (!showForm) {
    return null;
  }

  return (
    <Card
      className="my-12 max-w-[85vw] px-4 py-3"
      color={mainColor}
      data-test-id="game-night-form"
    >
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {t('game:game-night.title')}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <h3 className="mb-4 font-medium text-lg">{t('form:players')}</h3>
            {fields.map((field, index) => (
              <motion.div
                className="flex flex-row items-center gap-2"
                key={field.id}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  ease: [0.004, 0.998, 0, 0.973],
                  duration: 0.35,
                }}
              >
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`players.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex items-end space-x-2 pb-4">
                      <div className="grid flex-1 gap-1">
                        <FormLabel>
                          {t('form:player-name.placeholder', {
                            index: index + 1,
                          })}
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-test-id={`player-name-input-${index + 1}`}
                            className="min-w-36 md:min-w-72"
                            placeholder={t('form:player-name.placeholder', {
                              index: index + 1,
                            })}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`players.${index}.color`}
                  render={({ field }) => (
                    <FormItem className="flex items-end space-x-2 pb-4">
                      <div className="grid flex-1 gap-1">
                        <FormLabel>{t('color:color')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="w-32 md:w-[180px]"
                              data-test-id={`player-color-select-${index + 1}`}
                            >
                              <SelectValue
                                className="capitalize"
                                placeholder={t('color:select-color')}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colorsArray.map((color) => (
                              <SelectItem
                                key={color}
                                className="capitalize"
                                value={color}
                                data-test-id={`player-color-${color}-${index + 1}`}
                              >
                                <span
                                  className={cn(
                                    'h-2.5 w-2.5 rounded-full',
                                    getMainFromColor(color),
                                  )}
                                ></span>
                                {t(`color:${color}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  color={mainColor}
                  size={isMobile ? 'icon' : 'default'}
                  type="button"
                  variant="ghost"
                  disabled={index === 0}
                  onClick={() => remove(index)}
                >
                  <span className="hidden md:block">{t('action:remove')}</span>
                  <TrashIcon
                    className="block md:hidden"
                    aria-label={t('action:remove')}
                  />
                </Button>
              </motion.div>
            ))}

            {fields.length < 15 ? (
              <Button
                data-test-id="add-player-button"
                onClick={() => append({ name: '', color: mainColor })}
                type="button"
                variant="secondary"
              >
                {t('form:add-player')}
              </Button>
            ) : null}
          </div>

          <div>
            <h3 className="mb-4 font-medium text-lg">
              {t('game:scoring-system.title')}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info aria-hidden size={18} className="mt-1 ml-2" />
                  </TooltipTrigger>
                  <TooltipContent
                    color={mainColor}
                    className="w-[40vw] space-y-3 p-4"
                  >
                    <h4 className="text-center font-semibold text-lg underline">
                      {t('game:scoring-system.about')}
                    </h4>
                    <p>{t('game:scoring-system.description')}</p>
                    <ul className="space-y-2 pl-4">
                      <li className="space-y-1">
                        <p className="font-normal text-md">Winner takes all!</p>
                        <p className="text-xs">
                          {t('game:scoring-system.winner-only')}
                        </p>
                      </li>
                      <li className="space-y-1">
                        <p className="font-normal text-md">
                          {t('game:scoring-system.ranked.title')}
                        </p>
                        <p className="text-xs">
                          {t('game:scoring-system.ranked.description')}
                        </p>
                      </li>
                      <li className="space-y-1">
                        <p className="font-normal text-md">
                          {t('game:scoring-system.game-points.title')}
                        </p>
                        <p className="text-xs">
                          {t('game:scoring-system.game-points.description')}
                        </p>
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <FormField
              control={form.control}
              name="scoringMode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem
                            value="winner-only"
                            data-test-id="winner-only-scoring"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Winner takes all!
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem
                            value="ranked"
                            data-test-id="ranked-scoring"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('game:scoring-system.ranked.title')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem
                            value="game-points"
                            data-test-id="game-points-scoring"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('game:scoring-system.game-points.title')}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <CardAction className="flex justify-end gap-4">
            <Button
              color={mainColor}
              data-test-id="start-game-night-button"
              type="submit"
            >
              {t('game:game-night.start-game-night')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowForm(false)}
              data-test-id="cancel-game-night"
            >
              {t('action:cancel')}
            </Button>
          </CardAction>
        </form>
      </Form>
    </Card>
  );
}
