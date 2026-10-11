import {cookies, headers} from "next/headers";
import {cache} from "react";
import {getUser} from "../api/common";
import {isMobileUserAgent} from "../utils/global";
import type {OSType} from "../hooks/useDevice";

export const getSession = cache(async () => {
    const [h, c, user] = await Promise.all([
        headers(),
        cookies(),
        getUser()
    ]);
    const auth = c.get("token")?.value;
    const isMobile = isMobileUserAgent(h.get('user-agent') || "unknown");
    const os = (isMobile ? "mobile" : "desktop") as OSType;

    return { user, userToken: auth, os, isMobile, theme: c.get('theme')?.value === "dark" ? "dark":"light" } as const;
});