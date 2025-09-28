import { valibotResolver } from '@hookform/resolvers/valibot';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import { TrashIcon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as v from 'valibot';
import { getMainFromColor } from '@/lib/colorHelper';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import {
  gameAtom,
  mainColorAtom,
  playerAtom,
  showGameFormAtom,
} from '@/lib/jotai';
import {
  ColorEnum,
  colorsArray,
  type Player,
  WinningConditionEnum,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card, CardAction, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const gamenamePlaceholders = [
  'Flip 7',
  'Wingspan',
  'Everdell',
  'Terraforming Mars',
  'Great Western Trail',
  'Brass: Birmingham',
  'Root',
  'Castle Combo',
  'Cascadia',
];

export function GameForm() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [showForm, setShowForm] = useAtom(showGameFormAtom);
  const [players, setPlayers] = useAtom(playerAtom);
  const mainColor = useAtomValue(mainColorAtom);
  const setGame = useSetAtom(gameAtom);

  const playerSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, t('form:player-name.required'))),
    color: ColorEnum,
  });

  const formSchema = v.object({
    gameName: v.pipe(v.string(), v.minLength(1, t('form:game-name.required'))),
    players: v.pipe(
      v.array(playerSchema),
      v.minLength(1, t('form:at-least-one-player-required')),
    ),
    startValue: v.number(),
    winningCondition: WinningConditionEnum,
    endsAtScore: v.boolean(),
    scoreToEnd: v.optional(v.number()),
    endsAtSameRound: v.boolean(),
    endsAtRound: v.boolean(),
    roundToEnd: v.optional(v.number()),
  });

  const form = useForm({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      gameName: '',
      players: players.length
        ? players.map(({ name, color }) => ({ name, color }))
        : [{ name: '', color: mainColor }],
      startValue: 0,
      winningCondition: 'maxNumber',
      endsAtRound: false,
      endsAtScore: false,
      endsAtSameRound: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'players',
  });

  function onSubmit(values: v.InferOutput<typeof formSchema>) {
    const {
      gameName,
      players,
      startValue,
      winningCondition,
      endsAtScore,
      endsAtRound,
      scoreToEnd,
      roundToEnd,
      endsAtSameRound,
    } = values;

    setGame({
      name: gameName,
      winningCondition,
      startValue: startValue ?? 0,
      endsAtRound,
      roundToEnd: endsAtRound ? (roundToEnd ?? 10) : 0,
      endsAtScore: { ends: endsAtScore, sameRound: endsAtSameRound },
      scoreToEnd: endsAtScore ? (scoreToEnd ?? 100) : 0,
    });

    const playerArr = players.map((p, idx) => ({
      ...p,
      order: idx,
      id: Math.random().toString(36).substring(2, 15),
      rounds: [],
      currVal: startValue ?? 0,
    })) satisfies Player[];
    setPlayers(playerArr);
  }

  if (!showForm) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <h1 className="font-bold font-display text-8xl">Scorey</h1>
          <p data-test-id="tagline">{t('game:tagline')}</p>
        </div>
        <Button
          color={mainColor}
          data-test-id="start-game-button"
          onClick={() => setShowForm(true)}
        >
          {t('game:start-game.button')}
        </Button>
      </>
    );
  }

  return (
    <Card
      className="my-12 max-w-[85vw] px-4 py-3"
      color={mainColor}
      data-test-id="game-form"
    >
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {t('form:game-info')}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="gameName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form:game-name.label')}</FormLabel>
                <FormControl>
                  <Input
                    data-test-id="game-name-input"
                    placeholder={
                      gamenamePlaceholders[
                        Math.floor(Math.random() * gamenamePlaceholders.length)
                      ]
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="mb-4 font-medium text-lg">{t('form:players')}</h3>
            {fields.map((field, index) => (
              <div className="flex flex-row items-center gap-2" key={field.id}>
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
                  onClick={() => remove(index)}
                >
                  <span className="hidden md:block">{t('action:remove')}</span>
                  <TrashIcon
                    className="block md:hidden"
                    aria-label={t('action:remove')}
                  />
                </Button>
              </div>
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
              {t('form:options.index')}
            </h3>
            <FormField
              control={form.control}
              name="startValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form:options.game-start')}</FormLabel>
                  <FormControl>
                    <Input
                      data-test-id="start-value-input"
                      placeholder="100"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="winningCondition"
              render={({ field }) => (
                <FormItem className="my-4">
                  <FormLabel>{t('form:options.who-wins.question')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem
                            value="minNumber"
                            data-test-id="min-number-win"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('form:options.who-wins.min')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem
                            value="maxNumber"
                            data-test-id="max-number-win"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('form:options.who-wins.max')}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h3 className="mb-4 font-medium text-lg">
              {t('form:advanced-options.index')}
            </h3>{' '}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  color={mainColor}
                  checked={form.watch('endsAtRound')}
                  id="endsAtRound"
                  onCheckedChange={(checked) => {
                    form.setValue('endsAtRound', Boolean(checked));
                  }}
                  data-test-id="ends-at-round-checkbox"
                />
                <Label htmlFor="endsAtRound">
                  {t('form:advanced-options.ends-at-round-checkbox')}{' '}
                </Label>
              </div>
              {form.watch('endsAtRound') ? (
                <FormField
                  control={form.control}
                  name="roundToEnd"
                  render={({ field }) => (
                    <FormItem className="ml-4">
                      <FormLabel>
                        {t('form:advanced-options.round-to-be-finished-label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10"
                          min={1}
                          data-test-id="ends-at-round-input"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={form.watch('endsAtScore')}
                  color={mainColor}
                  id="endsAtScore"
                  data-test-id="ends-at-score-checkbox"
                  onCheckedChange={(checked) => {
                    form.setValue('endsAtScore', Boolean(checked));
                  }}
                />
                <Label htmlFor="endsAtScore">
                  {t('form:advanced-options.ends-at-score-checkbox')}
                </Label>
              </div>
              {form.watch('endsAtScore') ? (
                <div className="ml-4 flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="scoreToEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            'form:advanced-options.score-to-be-finished-label',
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="100"
                            data-test-id="ends-at-score-input"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number.parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={form.watch('endsAtSameRound')}
                      color={mainColor}
                      id="endsAtSameRound"
                      data-test-id="ends-at-same-round-checkbox"
                      onCheckedChange={(checked) => {
                        form.setValue('endsAtSameRound', Boolean(checked));
                      }}
                    />
                    <Label htmlFor="endsAtSameRound">
                      {t('form:advanced-options.same-round-checkbox')}
                    </Label>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <CardAction className="flex justify-end gap-4">
            <Button
              color={mainColor}
              data-test-id="create-game-button"
              type="submit"
            >
              {t('form:create-game')}
            </Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              {t('action:cancel')}
            </Button>
          </CardAction>
        </form>
      </Form>
    </Card>
  );
}
