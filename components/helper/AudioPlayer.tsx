"use client";

import {useEffect, useRef} from "react";

let _playSong: (name: string | null,args: any) => void = () => {
    // NO INTERACTION
};

function AudioPlayer() {
    const ding = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const unlock = () => {
            ding.current ||= new Audio();
            ding.current.volume = 1;
            _playSong = (name, args: any) => {
                if (!ding.current) return;
                if (!name) {
                    ding.current?.pause();
                    return;
                }
                ding.current.src = name.startsWith("http") ? name:"/mp3/" + name + ".mp3";
                ding.current.currentTime = 0;
                for (const key of Object.keys(args)) {
                    (ding.current as any)[key] = args[key];
                }
                ding.current.play().catch(console.error);
            };
        };

        document.addEventListener("click", unlock, { once: true });
        return () => document.removeEventListener("click", unlock);
    }, []);

    return null;
}

export function playSong(name: string | null, args: Partial<HTMLAudioElement> = {}) {
    _playSong(name,args);
}

export default AudioPlayer;
