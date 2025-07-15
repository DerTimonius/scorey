import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Card, CardAction, CardHeader, CardTitle } from './ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

const playerSchema = z.object({
  name: z.string().min(1, {
    message: 'Player name is required.',
  }),
});

const formSchema = z.object({
  gameName: z.string().min(1, {
    message: 'Game name is required.',
  }),
  players: z.array(playerSchema).min(1, {
    message: 'At least one player is required.',
  }),
});

export const StartGame = () => {
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameName: '',
      players: [{ name: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'players',
  });

  function onSubmit() {
    console.log('created game');
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
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="reverse"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </FormItem>
                )}
              />
            ))}

            {fields.length < 15 ? (
              <Button
                type="button"
                variant="neutral"
                onClick={() => append({ name: '' })}
              >
                Add Player
              </Button>
            ) : null}
          </div>

          <CardAction className="flex justify-end gap-4">
            <Button type="submit">Create Game</Button>
            <Button variant="neutral" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </CardAction>
        </form>
      </Form>
    </Card>
  );
};
