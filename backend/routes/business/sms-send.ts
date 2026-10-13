import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDevMode } from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const phone = (body.phone || "").toString().trim();

    if (!phone || phone.length < 10) {
        return NextResponse.json({
            message: "شماره تلفن معتبر نیست",
            status: false,
        }, { status: 400 });
    }

    const oneMinuteAgo = new Date(Date.now() - 60_000);
    const recent = await prisma.smsCode.findFirst({
        where: { phone, created_at: { gte: oneMinuteAgo } },
        orderBy: { created_at: "desc" },
    });

    if (recent) {
        return NextResponse.json({
            message: "کد قبلی هنوز منقضی نشده است. یک دقیقه صبر کنید.",
            status: false,
        }, { status: 429 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await prisma.smsCode.create({
        data: { phone, code, expires_at: expiresAt },
    });

    const dev = isDevMode();
    if (dev) {
        console.log(`[SMS-DEV] OTP for ${phone}: ${code}`);
    } else {
        const smsUrl = process.env.SMS_API_URL;
        const smsApiKey = process.env.SMS_API_KEY;
        if (smsUrl && smsApiKey) {
            try {
                await fetch(smsUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${smsApiKey}`,
                    },
                    body: JSON.stringify({
                        phone,
                        message: `کد تایید شما: ${code}`,
                    }),
                });
            } catch (e) {
                console.error("[SMS] Failed to send:", e);
            }
        } else {
            console.warn("[SMS] No SMS gateway configured. OTP will not be sent in production.");
        }
    }

    return NextResponse.json({
        message: "کد تایید ارسال شد",
        status: true,
        ttl: 120,
        ...(dev ? { dev_code: code } : {}),
    });
}
