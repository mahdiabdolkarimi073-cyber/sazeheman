'use server';
import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";
import {generateToken, createOrUpdateUser} from "@/lib/api/auth";
import {DebugMode} from "@/lib/VARS";

export async function setUserToken(token: string) {
    const cookie = await cookies();
    const ex = new Date();
    ex.setDate(ex.getDate() + 30);
    cookie.set("token", token, {
        path: "/",
        expires: ex,
        httpOnly: true,
        sameSite: "lax",
    });

    return {
        ok: true
    }
}

export async function logout() {
    const c = await cookies();
    const token = c.get('token')?.value;
    if (token) {
        await prisma.user.updateMany({
            where: { token },
            data: { token: null, token_expires: null },
        }).catch(() => {});
    }
    c.delete("token");
    return true;
}

export async function authUser(phone: string, accountType: string = 'sazeheman') {
    const user = await createOrUpdateUser(phone, accountType);
    await setUserToken(user.token);

    return {
        id: user.id,
        phone: user.phone,
        role: user.role,
        account_type: user.account_type,
        nickname: user.nickname,
        slug: user.slug,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        plan: user.plan,
        created_at: user.created_at.toISOString(),
    };
}
