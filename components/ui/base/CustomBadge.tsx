'use client';

import useTheme from "@/lib/hooks/useTheme";
import {ReactNode, useMemo} from "react";
import {twMerge} from "tailwind-merge";

function CustomBadge({success = false, color = success ? "var(--primary)" : "red", ...props}: {
    color?: string,
    children: ReactNode,
    success?: boolean,
    noDarkness?: boolean,
    circle?: boolean,
    className?: string
}) {
    const [theme] = useTheme();
    const isDark = useMemo(()=>theme === 'dark', [theme]);
    return (
        <div className={twMerge(`rounded-full ${!props.circle && "px-2"} w-fit py-0.5 pt-1 text-xs flex items-center justify-center text-center relative overflow-hidden`, props?.className)}>
            <div className='absolute left-0 top-0 opacity-30 w-full h-full z-0' style={{ background: color, filter: `brightness(${isDark ? "0.7":"1.2"})` }} />
            <span className="z-10 font-medium" style={{ color, filter: props.noDarkness ? "":`brightness(${isDark ? "1.1":"0.7"})` }}>{props.children}</span>
        </div>
    )
}

export default CustomBadge;