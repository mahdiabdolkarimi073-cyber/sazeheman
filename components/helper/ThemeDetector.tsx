'use client';

import useTheme from '@/lib/hooks/useTheme';
import { ActionIcon } from '@mantine/core';
import { useEffect } from 'react';
import { IconMoon } from '../ui/SVGs';

export default function ThemeDetector() {
    const [theme, setTheme] = useTheme();

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme-preference');
        if (storedTheme) return;

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const browserTheme = prefersDark ? 'dark' : 'light';
        if (browserTheme === theme) return;

        setTheme(browserTheme);
        localStorage.setItem('theme-preference', 'set');
    }, [theme, setTheme]);

    return null;
}

export function ThemeChanger() {
    const [theme, setTheme] = useTheme();

    return (
        <ActionIcon
            variant='transparent'
            color='var(--text-color)'
            onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
            }}
        >
            <IconMoon fill='var(--text-color)' width={'20px'} />
        </ActionIcon>
    )
}