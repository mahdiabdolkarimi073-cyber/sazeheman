import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError, authErrorResponse } from "@/lib/api/auth";
import { requestOtpCode } from "@/lib/sms";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    try {
        await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const result = await requestOtpCode(body.phone || "", "POST /api/profile/verification/phone");

    if (!result.ok) {
        return NextResponse.json({
            message: result.message,
            status: false,
            traceId: result.traceId,
            errorCode: result.errorCode,
            durationMs: result.durationMs,
            ...(result.ttl ? { ttl: result.ttl } : {}),
        }, { status: result.status });
    }

    return NextResponse.json({
        message: result.message,
        status: true,
        ttl: result.ttl ?? 120,
        phone: result.phone,
        traceId: result.traceId,
        durationMs: result.durationMs,
    });
}
