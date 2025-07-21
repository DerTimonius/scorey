import { zodResolver } from '@hookform/resolvers/zod';
import { useSetAtom } from 'jotai/react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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

const playerSchema = z.object({
  name: z.string().min(1, {
    message: 'Player name is required.',
  }),
  color: ColorEnum,
});

const formSchema = z.object({
  gameName: z.string().min(1, {
    message: 'Game name is required.',
  }),
  players: z.array(playerSchema).min(1, {
    message: 'At least one player is required.',
  }),
  startValue: z.number(),
  winningCondition: WinningConditionEnum,
  endsAtScore: z.boolean(),
  scoreToEnd: z.number().optional(),
  endsAtRound: z.boolean(),
  roundToEnd: z.number().optional(),
});

export function GameForm() {
  const [showForm, setShowForm] = useState(false);
  const setGame = useSetAtom(gameAtom);
  const setPlayers = useSetAtom(playerAtom);

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
      id: crypto.randomUUID() as string,
      rounds: [],
      currVal: startValue,
    })) satisfies Player[];
    setPlayers(playerArr);
  }

  if (!showForm) {
    return <Button onClick={() => setShowForm(true)}>Start game</Button>;
  }

  return (
    <Card className="px-4 py-3">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Start new game</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="gameName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter game name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="mb-4 font-medium text-lg">Players</h3>
            {fields.map((field, index) => (
              <div className="flex flex-row items-center gap-2" key={field.id}>
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`players.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex items-end space-x-2 pb-4">
                      <div className="grid flex-1 gap-1">
                        <FormLabel>Player {index + 1} Name</FormLabel>
                        <FormControl>
                          <Input
                            className="min-w-72"
                            placeholder={`Player ${index + 1}`}
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
                        <FormLabel>Color</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a color" />
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
                                {color}
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
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            {fields.length < 15 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => append({ name: '', color: DEFAULT_COLOR })}
              >
                Add Player
              </Button>
            ) : null}
          </div>

          <div>
            <h3 className="mb-4 font-medium text-lg">Game options</h3>
            <FormField
              control={form.control}
              name="startValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game starts at (points)</FormLabel>
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
                  <FormLabel>Who wins?</FormLabel>
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
                          Player with fewest points
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="maxNumber" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Player with most points
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
            <h3 className="mb-4 font-medium text-lg">Advanced settings</h3>{' '}
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
                  Game ends after a certain round has been played
                </Label>
              </div>
              {form.watch('endsAtRound') ? (
                <FormField
                  control={form.control}
                  name="roundToEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Round to be finished</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
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
                  Game ends after a player hits a certain score
                </Label>
              </div>
              {form.watch('endsAtScore') ? (
                <FormField
                  control={form.control}
                  name="scoreToEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game ends at points</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="100"
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
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
            <Button type="submit">Create Game</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </CardAction>
        </form>
      </Form>
    </Card>
  );
}
