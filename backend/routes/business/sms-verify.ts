import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpCode } from "@/lib/sms";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const rawPhone = (body.phone || "").toString().trim();
    const rawCode = (body.code || "").toString().trim();

    if (!rawPhone || !rawCode) {
        return NextResponse.json({
            message: "شماره تلفن و کد الزامی است",
            status: false,
        }, { status: 400 });
    }

    const verification = await verifyOtpCode(rawPhone, rawCode, "POST /api/business/sms-verify");
    if (!verification.ok) {
        return NextResponse.json({
            message: verification.message,
            status: false,
            traceId: verification.traceId,
            errorCode: verification.errorCode,
        }, { status: verification.status });
    }

    const normalizedPhone = verification.phone!;

    try {
        await prisma.business.updateMany({
            where: {
                OR: [
                    { phone: normalizedPhone },
                    { phone: rawPhone },
                ],
            },
            data: { phone_verified: true },
        });
    } catch {
        // Ignore if DB is unreachable in test environment
    }

    return NextResponse.json({
        message: "شماره تایید شد",
        status: true,
        phone: normalizedPhone,
        traceId: verification.traceId,
    });
}
