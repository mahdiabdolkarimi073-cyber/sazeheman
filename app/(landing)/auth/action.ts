'use server';
import {cookies} from "next/headers";
import {prisma} from "@/lib/prisma";
import {createOrUpdateUser} from "@/lib/api/auth";
import {
    normalizeIranPhone,
    isValidIranPhone,
    requestOtpCode,
    verifyOtpCode,
    hasRecentVerifiedMemoryOtp,
} from "@/lib/sms";

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
    };
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

export async function sendAuthCode(phone: string, source: string = "ServerAction:sendAuthCode") {
    const result = await requestOtpCode(phone, source);
    return {
        ok: result.ok,
        status: result.status,
        message: result.message,
        ttl: result.ttl ?? 120,
        phone: result.phone,
        traceId: result.traceId,
        errorCode: result.errorCode,
        durationMs: result.durationMs,
    };
}

export async function authUser(phone: string, accountType: string = 'sazeheman', code?: string) {
    const normalizedPhone = normalizeIranPhone(phone);
    if (!isValidIranPhone(normalizedPhone)) {
        throw new Error("شماره موبایل معتبر نیست");
    }

    if (code !== undefined) {
        const verification = await verifyOtpCode(normalizedPhone, code, "ServerAction:authUser");
        if (!verification.ok) {
            throw new Error(verification.message);
        }
    } else {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        let verifiedOtp = null;
        let verifiedBusiness = null;

        try {
            verifiedOtp = await prisma.smsCode.findFirst({
                where: {
                    phone: normalizedPhone,
                    used: true,
                    created_at: { gte: thirtyMinutesAgo },
                },
                orderBy: { created_at: "desc" },
            });

            if (!verifiedOtp) {
                verifiedBusiness = await prisma.business.findFirst({
                    where: {
                        phone: normalizedPhone,
                        phone_verified: true,
                    },
                });
            }
        } catch {
            // Fallback to in-memory verification check if DB is unreachable
        }

        const memoryVerified = hasRecentVerifiedMemoryOtp(normalizedPhone);

        if (!verifiedOtp && !verifiedBusiness && !memoryVerified) {
            throw new Error("شماره موبایل تایید نشده است. لطفاً ابتدا کد پیامکی را تایید کنید.");
        }
    }

    const user = await createOrUpdateUser(normalizedPhone, accountType);
    await setUserToken(user.token!);

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
        created_at: user.created_at instanceof Date ? user.created_at.toISOString() : String(user.created_at),
    };
}
