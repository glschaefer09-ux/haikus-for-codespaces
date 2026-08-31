import { useEffect } from 'react';
import type { Theme } from '@shared/types';

export function useAppliedTheme(theme: Theme | undefined) {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    function apply() {
      const dark = theme === 'dark' || (theme !== 'light' && media.matches);
      root.classList.toggle('dark', dark);
    }

    apply();
    if (theme === 'system' || theme === undefined) {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
    return undefined;
  }, [theme]);
}
