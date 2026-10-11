import { useContext, useEffect, useRef, useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import { setTheme } from "@/lib/hooks/actions/setTheme";
import { useTrueEffect } from "./useEffect";


function useTheme() {
    const [theme, changeTheme] = useContext(ThemeContext);

    return [theme, changeTheme] as const;
}

export function isDark() {
    const [theme] = useTheme();
    return theme === 'dark';
}

export default useTheme;