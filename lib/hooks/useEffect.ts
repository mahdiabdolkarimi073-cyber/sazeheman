import { EffectCallback, useEffect, useRef } from "react";

export function useDelayedEffect(func: EffectCallback, deps: any[], delay: number = 100) {
    const thread = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        clearTimeout(thread.current || -1);
        thread.current = setTimeout(func, delay);
        return () => clearTimeout(thread.current || -1);
    }, deps);
}

export function useTrueEffect(func: EffectCallback, deps: any[], delay?: number) {
    const thread = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const prev = useRef<string>(JSON.stringify(deps));

    const doo = () => {
        const js = JSON.stringify(deps);
        if (prev.current === js) return;
        prev.current = js;
        func();
    }

    useEffect(() => {
        clearTimeout(thread.current || -1);
        thread.current = setTimeout(doo, delay);
        return () => clearTimeout(thread.current || -1);
    }, deps);
}