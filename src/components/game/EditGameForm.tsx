import { valibotResolver } from '@hookform/resolvers/valibot';
import { useAtom, useAtomValue } from 'jotai';
import { Cog } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as v from 'valibot';
import { gameAtom, mainColorAtom } from '@/lib/jotai';
import { WinningConditionEnum } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
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

export function EditGameForm() {
  const { t } = useTranslation();
  const mainColor = useAtomValue(mainColorAtom);
  const [game, setGame] = useAtom(gameAtom);

  const formSchema = v.object({
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
      startValue: game?.startValue ?? 0,
      winningCondition: game?.winningCondition ?? 'maxNumber',
      endsAtRound: game?.endsAtRound ?? false,
      endsAtScore: game?.endsAtScore.ends ?? false,
      endsAtSameRound: game?.endsAtScore.sameRound ?? true,
      scoreToEnd: game?.scoreToEnd,
      roundToEnd: game?.roundToEnd,
    },
  });

  function onSubmit(values: v.InferOutput<typeof formSchema>) {
    const {
      startValue,
      winningCondition,
      endsAtScore,
      endsAtRound,
      scoreToEnd,
      roundToEnd,
      endsAtSameRound,
    } = values;

    setGame(
      (prev) =>
        prev && {
          ...prev,
          winningCondition,
          startValue: startValue ?? 0,
          endsAtRound,
          roundToEnd: endsAtRound ? (roundToEnd ?? 10) : 0,
          endsAtScore: { ends: endsAtScore, sameRound: endsAtSameRound },
          scoreToEnd: endsAtScore ? (scoreToEnd ?? 100) : 0,
        },
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button color={mainColor} variant="ghost">
          <Cog aria-hidden className="!size-6" />
          <span className="sr-only">{t('game:edit-game.title')}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('game:edit-game.title')}</AlertDialogTitle>
            </AlertDialogHeader>
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
                          {t(
                            'form:advanced-options.round-to-be-finished-label',
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10"
                            min={1}
                            data-test-id="ends-at-round-input"
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

            <AlertDialogFooter className="flex justify-end gap-4">
              <AlertDialogAction asChild>
                <Button color={mainColor} type="submit">
                  {t('action:save')}
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel>{t('action:cancel')}</AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
