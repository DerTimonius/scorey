import { valibotResolver } from '@hookform/resolvers/valibot';
import { useSetAtom } from 'jotai/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as v from 'valibot';
import { gameAtom, playerAtom } from '@/lib/jotai';
import { WinningConditionEnum } from '@/lib/types';
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

export function GameNightGameForm() {
  const { t } = useTranslation();

  const setGame = useSetAtom(gameAtom);
  const setPlayers = useSetAtom(playerAtom);

  const formSchema = v.object({
    gameName: v.pipe(v.string(), v.minLength(1, t('form:game-name.required'))),
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
      startValue: 0,
      winningCondition: 'maxNumber',
      endsAtRound: false,
      endsAtScore: false,
      endsAtSameRound: true,
    },
  });

  function onSubmit(values: v.InferOutput<typeof formSchema>) {
    const {
      gameName,
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

    setPlayers((prev) =>
      prev.map((p) => ({ ...p, rounds: [], currVal: startValue ?? 0 })),
    );
  }

  return (
    <Card
      className="my-12 max-w-[85vw] px-4 py-3"
      color="blue"
      data-test-id="game-night-game-form"
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
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
                  color="blue"
                  checked={form.watch('endsAtRound')}
                  id="endsAtRound"
                  onCheckedChange={(checked) => {
                    form.setValue('endsAtRound', Boolean(checked));
                    if (!checked) form.setValue('roundToEnd', 0);
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
                            field.onChange(Number.parseInt(e.target.value, 10))
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
                  color="blue"
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
                              field.onChange(
                                Number.parseInt(e.target.value, 10),
                              )
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
                      color="blue"
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
              color="blue"
              data-test-id="create-game-night-game-button"
              type="submit"
            >
              {t('form:create-game')}
            </Button>
          </CardAction>
        </form>
      </Form>
    </Card>
  );
}
