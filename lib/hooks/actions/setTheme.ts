'use server';

import {cookies} from "next/headers";

export async function setTheme(theme: "dark" | "light") {
    const c = await cookies();
    const ex =new Date();
    ex.setMonth(ex.getMonth() + 12);

    c.set("theme", theme, {
        expires: ex.getTime(),
        path: "/"
    });

    return "done";
}