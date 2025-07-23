import { zodResolver } from '@hookform/resolvers/zod';
import { useSetAtom } from 'jotai/react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { getBgFromColor } from '@/lib/colorHelper';
import { DEFAULT_COLOR } from '@/lib/constants';
import { gameAtom, playerAtom } from '@/lib/jotai';
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
import { TrashIcon } from 'lucide-react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

const gamenamePlaceholders = [
  'Flip 7',
  'Wingspan',
  'Everdell',
  'Terraforming Mars',
  'Spicy',
  'Great Western Trail',
  'Brass: Birmingham',
  'Root',
];

export function GameForm() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const setGame = useSetAtom(gameAtom);
  const setPlayers = useSetAtom(playerAtom);
  const isMobile = useIsMobile();

  const playerSchema = z.object({
    name: z.string().min(1, {
      message: t('form:player-name.required'),
    }),
    color: ColorEnum,
  });

  const formSchema = z.object({
    gameName: z.string().min(1, {
      message: t('form:game-name.required'),
    }),
    players: z.array(playerSchema).min(1, {
      message: t('form:at-least-one-player-required'),
    }),
    startValue: z.number(),
    winningCondition: WinningConditionEnum,
    endsAtScore: z.boolean(),
    scoreToEnd: z.number().optional(),
    endsAtRound: z.boolean(),
    roundToEnd: z.number().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameName: '',
      players: [{ name: '', color: DEFAULT_COLOR }],
      startValue: 0,
      winningCondition: 'maxNumber',
      endsAtRound: false,
      endsAtScore: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'players',
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      gameName,
      players,
      startValue,
      winningCondition,
      endsAtScore,
      endsAtRound,
      scoreToEnd,
      roundToEnd,
    } = values;

    setGame({
      name: gameName,
      winningCondition,
      startValue,
      endsAtRound,
      roundToEnd: endsAtRound ? (roundToEnd ?? 10) : 0,
      endsAtScore,
      scoreToEnd: endsAtScore ? (scoreToEnd ?? 100) : 0,
    });

    const playerArr = players.map((p, idx) => ({
      ...p,
      order: idx,
      id: Math.random().toString(36).substring(2, 15),
      rounds: [],
      currVal: startValue,
    })) satisfies Player[];
    setPlayers(playerArr);
  }

  if (!showForm) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <h1 className="font-bold font-display text-8xl">Scorey</h1>
          <p>{t('game:tagline')}</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          {t('game:start-game.button')}
        </Button>
      </>
    );
  }

  return (
    <Card className="my-12 max-w-[85vw] px-4 py-3">
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
                          {t('form:player-name.label', { index: index + 1 })}
                        </FormLabel>
                        <FormControl>
                          <Input
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
                            <SelectTrigger className="w-32 md:w-[180px]">
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
                              >
                                <span
                                  className={cn(
                                    'h-2.5 w-2.5 rounded-full',
                                    getBgFromColor(color),
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
                type="button"
                variant="secondary"
                onClick={() => append({ name: '', color: DEFAULT_COLOR })}
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
                    <Input placeholder="100" type="number" {...field} />
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
                          <RadioGroupItem value="minNumber" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t('form:options.who-wins.min')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="maxNumber" />
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
                  checked={form.watch('endsAtRound')}
                  id="endsAtRound"
                  onCheckedChange={(checked) => {
                    form.setValue('endsAtRound', Boolean(checked));
                  }}
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
                    <FormItem>
                      <FormLabel>
                        {t('form:advanced-options.round-to-be-finished-label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10"
                          min={1}
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
                  id="endsAtScore"
                  onCheckedChange={(checked) => {
                    form.setValue('endsAtScore', Boolean(checked));
                  }}
                />
                <Label htmlFor="endsAtScore">
                  {t('form:advanced-options.ends-at-score-checkbox')}
                </Label>
              </div>
              {form.watch('endsAtScore') ? (
                <FormField
                  control={form.control}
                  name="scoreToEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('form:advanced-options.score-to-be-finished-label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="100"
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
            </div>
          </div>

          <CardAction className="flex justify-end gap-4">
            <Button type="submit">{t('form:create-game')}</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              {t('action:cancel')}
            </Button>
          </CardAction>
        </form>
      </Form>
    </Card>
  );
}
