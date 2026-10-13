import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const phone = (body.phone || "").toString().trim();
    const code = (body.code || "").toString().trim();

    if (!phone || !code) {
        return NextResponse.json({
            message: "شماره تلفن و کد الزامی است",
            status: false,
        }, { status: 400 });
    }

    const now = new Date();
    const latestCode = await prisma.smsCode.findFirst({
        where: {
            phone,
            used: false,
            expires_at: { gt: now },
        },
        orderBy: { created_at: "desc" },
    });

    if (!latestCode) {
        return NextResponse.json({
            message: "کد معتبر نیست یا منقضی شده است",
            status: false,
        }, { status: 400 });
    }

    if (latestCode.attempts >= 5) {
        await prisma.smsCode.update({
            where: { id: latestCode.id },
            data: { used: true },
        });
        return NextResponse.json({
            message: "تعداد تلاش‌ها بیش از حد مجاز است",
            status: false,
        }, { status: 429 });
    }

    if (latestCode.code !== code) {
        await prisma.smsCode.update({
            where: { id: latestCode.id },
            data: { attempts: { increment: 1 } },
        });
        return NextResponse.json({
            message: "کد اشتباه است",
            status: false,
        }, { status: 400 });
    }

    await prisma.smsCode.update({
        where: { id: latestCode.id },
        data: { used: true },
    });

    await prisma.business.updateMany({
        where: { phone },
        data: { phone_verified: true },
    });

    return NextResponse.json({
        message: "شماره تایید شد",
        status: true,
    });
}
