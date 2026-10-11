'use client';


import {useEffect, useRef, useState} from "react";
import {usePathname} from "next/navigation";
import {useInterval} from "@mantine/hooks";


let events: Record<string, Function> = {};
function LinkLoader() {
    const pathname = usePathname();
    const [loading, setLoading] = useState<string>()

    useInterval(() => {
        if (typeof window === 'undefined') return;

        const links = Array.from(
            document.querySelectorAll('a[href^="/"],[data-link]') as NodeListOf<HTMLLinkElement>
        );
        for (let link of links) {
            const ref = link.getAttribute('href') ?? link.getAttribute('data-link');
            if (!ref || ref.startsWith("http")) continue;
            if (link.hasAttribute('registered')) continue;
            link.setAttribute("registered", 'true')
            link.addEventListener('click', ()=>{
                const path = new URL(location.origin);
                path.pathname = ref;
                if (location.pathname === path.pathname) return;
                setLoading(path.pathname);
            })
        }
    },500, {autoInvoke: true});

    useEffect(() => {
        if (loading) {
            setLoading(undefined);
            return;
        }
    }, [pathname]);
    useEffect(() => {
        for (let event of Object.values(events)) {
            event(loading);
        }
    }, [loading]);

    return null;
}

export function useLinkLoader() {
    const [loading, setLoading] = useState<string>()
    const id = useRef(Math.random().toString(16));

    useEffect(() => {
        if (events[id.current]) return;
        events[id.current] = (l: string | undefined) => {
            setLoading(l);
        }
        return ()=>{
            delete events[id.current];
        }
    }, []);

    return loading;
}

export default LinkLoader;