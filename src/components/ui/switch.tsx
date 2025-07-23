import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { DEFAULT_COLOR } from '@/lib/constants';
import type { VariantColor } from '@/lib/types';
import { cn } from '@/lib/utils';

const switchVariants = cva(
  'peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-border bg-secondary-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-white',
  {
    variants: {
      color: {
        red: 'data-[state=checked]:bg-red-main',
        orange: 'data-[state=checked]:bg-orange-main',
        amber: 'data-[state=checked]:bg-amber-main',
        yellow: 'data-[state=checked]:bg-yellow-main',
        lime: 'data-[state=checked]:bg-lime-main',
        green: 'data-[state=checked]:bg-green-main',
        emerald: 'data-[state=checked]:bg-emerald-main',
        teal: 'data-[state=checked]:bg-teal-main',
        cyan: 'data-[state=checked]:bg-cyan-main',
        sky: 'data-[state=checked]:bg-sky-main',
        blue: 'data-[state=checked]:bg-blue-main',
        indigo: 'data-[state=checked]:bg-indigo-main',
        violet: 'data-[state=checked]:bg-violet-main',
        purple: 'data-[state=checked]:bg-purple-main',
        fuchsia: 'data-[state=checked]:bg-fuchsia-main',
        pink: 'data-[state=checked]:bg-pink-main',
        rose: 'data-[state=checked]:bg-rose-main',
      } satisfies VariantColor,
    },
    defaultVariants: {
      color: DEFAULT_COLOR,
    },
  },
);

function Switch({
  className,
  color,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ color }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white border-2 border-border ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
