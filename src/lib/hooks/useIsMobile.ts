import * as React from 'react';

export function useIsMobile(breakpoint: 425 | 640 | 768 | 1024 = 640) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, [breakpoint]);

  return Boolean(isMobile);
}
