"use client";
import {notifications} from "@mantine/notifications";
import {showModal, showModalInit} from "@/components/ui/modals/modals";
import {usePathname, useRouter} from "next/navigation";
import {useEffect} from "react";
import {closeAllModals} from "@mantine/modals";
import "./built-in-override";
import {VARS} from "@/lib/VARS";
import {UserType} from "@/lib/hooks/useUser";

declare global {
    interface Window {
        routerPush: (path: string) => void;
        backendUrl: string;
        userToken: string | undefined;
        showModal: typeof showModal;
        device:
            | "mobile"
            | "tablet"
            | "console"
            | "smarttv"
            | "wearable"
            | "embedded"
            | "desktop"
            | undefined;
        throw: (msg: string) => never;
        user: UserType;
        appliedOv?: string[],
        theme?: "dark" | "light"
    }
}

if (typeof window !== "undefined") {
    window.backendUrl = VARS.BACKEND_URL || "https://unknown.backend";
    window.showModal = showModal;
}

const OverrideWindow = (
    props: Partial<typeof window> & Record<string, any>
) => {
    const pathname = usePathname();
    const router = useRouter();

    if (typeof window !== "undefined") {
        showModalInit();
        window.throw = (msg) => {
            window.alert(msg);
            throw msg;
        };
        let lastAlarm = new Date();
        const limitedSec = 1;
        window.alert = (txt: string) => {
            const ex = new Date(lastAlarm);
            ex.setSeconds(ex.getSeconds() + limitedSec);
            if (ex.getTime() >= Date.now()) return;

            if (!txt) return;
            const type =
                txt.includes("خطا") || txt.includes("اشتباه")
                    ? "ERROR"
                    : txt.includes("موفق") || txt.includes(" شد ")
                    ? "SUCCESS"
                    : "WARN";
            const title =
                type === "ERROR" ? "خطا" : type === "WARN" ? "هشدار" : "پیغام";

            notifications.show({
                title: <h3>{title}</h3>,
                message: <p className={"text-[17px]"}>{txt}</p>,
                color:
                    type === "ERROR"
                        ? "red"
                        : type === "WARN"
                        ? "orange"
                        : "green",
                radius: "sm",
            });
            lastAlarm = new Date();
        };
        

        window.routerPush = (path) => {
            router.push(path);
            setTimeout(() => {
                router.refresh();
            }, 100);
        };
    }

    useEffect(() => {
        closeAllModals();
    }, [pathname]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const applied =  window.appliedOv || [];
        const ov = {
            ...Object.fromEntries(applied.map(o => [o, undefined])),
            ...props
        }
        
        for (const [key, v] of Object.entries(ov)) {
            (window as any)[key] = v;
            applied.push(key);
        }
        
        window.appliedOv= Array.from(new Set(applied));
    }, [props]);
    
    const overwrites = Object.entries(props)
        .map(([key, value]) => {
            if (!key) return undefined;
            try {
                return `window["${key}"] = ${JSON.stringify(value)}`;
            } catch (error) {
                if (process.env.NODE_ENV === "development") {
                    console.error(`Failed to serialize window.${key}:`, error);
                }
                return undefined;
            }
        })
        .filter(Boolean);

    return (
        <script
            key={'script'}
            id={'ov-win'}
            dangerouslySetInnerHTML={{ __html: overwrites.join("; ") }}
        ></script>
    );
};

export default OverrideWindow;
