import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeState } from '@/types';

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });

        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
      },

      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
