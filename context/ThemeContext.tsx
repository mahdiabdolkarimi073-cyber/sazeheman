'use client';

import { setTheme } from '@/lib/hooks/actions/setTheme';
import { useTrueEffect } from '@/lib/hooks/useEffect';
import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext<[
    'dark' | 'light',
    (theme: 'dark' | 'light') => void
]>([] as any);

export function ThemeContextProvider(props: { theme: "dark" | 'light', children: any }) {
    const [theme, c] = useState(props.theme);

    useTrueEffect(() => {
        setTheme(theme)
            .catch(console.error);
    }, [theme], 500);

    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        } else {
            document.documentElement.classList.remove("light");
            document.documentElement.classList.add("dark");
        }
        document.documentElement.setAttribute("data-mantine-color-scheme", theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={[theme, c]}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext;