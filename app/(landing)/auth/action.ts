'use server';
import {cookies} from "next/headers";

export async function setUserToken(token: string) {
    const cookie = await cookies();
    const ex = new Date();
    ex.setDate(ex.getDate() + 3);
    cookie.set("token", token, {
        path: "/",
        expires: ex
    });

    return {
        ok: true
    }
}

export async function logout() {
    const c = await cookies();
    c.delete("token");
    return true;
}

global._USERS ||= {};

export async function authUser(phone: number, accountType: string = 'sazeheman') {
    const existing = Object.values(global._USERS).find((user) => user.phone === phone+"");
    const user = existing || {
        phone: phone+"",
        token: `${Math.random().toString(36)}-${Math.random().toString(36)}`,
        id: Math.random().toString(36).slice(2),
        nickname: "",
        slug: "",
        first_name: "",
        last_name: "",
        email: "",
        plan: "free",
        account_type: accountType,
        created_at: new Date().toISOString(),
    };
    if (existing && !existing.account_type) {
        existing.account_type = accountType;
    }

    global._USERS[user.token] = user;
    await setUserToken(user.token);
    return user;
}
