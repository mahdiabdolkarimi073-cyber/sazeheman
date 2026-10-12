"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {VARS} from "../VARS";
import { convertToIRUrl } from "./base";

declare global {
    interface Window {
        Pusher: typeof Pusher;
        EchoReverb: Echo<"reverb">;
        EchoEvents: Record<
            string,
            {
                id: string;
                event: string;
                func: (msg: any) => void;
            }[]
        >;
        EchoUser: ReturnType<(typeof window.EchoReverb)["private"]>;
    }
}

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_PUSHER_HOST) {
    try {
        window.Pusher = Pusher;
        const pusherHost = convertToIRUrl(process.env.NEXT_PUBLIC_PUSHER_HOST, true);
        const backendOrigin = typeof window !== 'undefined' ? window.location.origin : (VARS.FRONTEND_URL || "http://localhost:3000");
        window.EchoReverb = new Echo({
            broadcaster: "reverb",
            key: process.env.NEXT_PUBLIC_PUSHER_TOKEN || "",
            wsHost: pusherHost,
            wsPort: 443,
            wssPort: 443,
            forceTLS: true,
            enabledTransports: ["ws", "wss"],
            authEndpoint: backendOrigin + "/api/broadcasting/auth",
            auth: {
                headers: {
                    Authorization: `Bearer ${window.userToken || "unauthenticated"}`,
                },
            },
        });
        window.EchoReverb.connector.pusher.connection.bind(
            "state_change",
            (states: any) => {
                console.log("[ECHO] Connection state:", states.current);
            }
        );
    } catch (e) {
        console.warn("[ECHO] Failed to initialize:", e);
    }
}

export function listenToEcho(event: string, func: (msg: any) => void) {
    if (typeof window === "undefined") return;
    if (!window.user) {
        console.log("[ECHO] user required");
        return undefined;
    }

    const connection =
        window.EchoUser || window.EchoReverb.private("user." + window.user.id);
    window.EchoUser ||= connection;
    window.EchoEvents ||= {};
    const register = !window.EchoEvents[event];
    window.EchoEvents[event] ||= [];
    const id = (Math.random() * 70).toString(16);
    window.EchoEvents[event].push({
        id,
        event: event,
        func,
    });
    if (!register) return id;
    connection.listen(event, (msg: any) => {
        const events = window.EchoEvents[event] || [];
        if (!events.length) {
            window.EchoUser.stopListening(event);
            return;
        }

        for (const handler of events) {
            try {
                handler.func(msg);
            } catch (e: any) {
                console.log("[ECHO:EVENT]", handler.event, handler.id, e);
            }
        }
    });
    return id;
}

export function stopListening(event: string, id?: string) {
    if (id) {
        window.EchoEvents[event] = (window.EchoEvents[event] || []).filter(
            (o) => o.id !== id
        );
        if (!window.EchoEvents[event].length) {
            window.EchoUser?.stopListening(event);
            delete window.EchoEvents[event];
        }
    } else if (!!window.EchoEvents) {
        window.EchoUser?.stopListening(event);
        delete window.EchoEvents[event];
    }
}
