import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import type * as React from 'react';
import { DEFAULT_COLOR } from '@/lib/constants';
import type { VariantColor } from '@/lib/types';
import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  'peer size-4 shrink-0 outline-2 outline-border ring-offset-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-white',
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

function Checkbox({
  className,
  color,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ color }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn('flex items-center justify-center text-current')}
      >
        <Check className="size-4 text-black" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
