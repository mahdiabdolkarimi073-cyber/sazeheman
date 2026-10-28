import { NextRequest, NextResponse } from "next/server";
import { verifyOtpCode } from "@/lib/sms";
import { createOrUpdateUser } from "@/lib/api/auth";
import { setUserToken } from "@/app/(landing)/auth/action";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const rawPhone = (body.phone || "").toString().trim();
    const rawCode = (body.code || "").toString().trim();
    const accountType = (body.account_type || "sazeheman").toString().trim();

    if (!rawPhone || !rawCode) {
        return NextResponse.json({
            message: "شماره تلفن و کد الزامی است",
            status: false,
        }, { status: 400 });
    }

    const verification = await verifyOtpCode(rawPhone, rawCode, "POST /api/auth/sms-verify");
    if (!verification.ok) {
        return NextResponse.json({
            message: verification.message,
            status: false,
            traceId: verification.traceId,
            errorCode: verification.errorCode,
        }, { status: verification.status });
    }

    const normalizedPhone = verification.phone!;
    const user = await createOrUpdateUser(normalizedPhone, accountType);
    await setUserToken(user.token!);

    return NextResponse.json({
        message: "ورود با موفقیت انجام شد",
        status: true,
        phone: normalizedPhone,
        traceId: verification.traceId,
    });
}
