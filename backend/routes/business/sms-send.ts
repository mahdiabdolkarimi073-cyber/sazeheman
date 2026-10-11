import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await prisma.smsCode.create({
        data: { phone, code, expires_at: expiresAt },
    });

    console.log(`[SMS] OTP for ${phone}: ${code}`);

    return NextResponse.json({
        message: "کد تایید ارسال شد",
        status: true,
        ttl: 120,
        dev_code: code,
    });
}
