import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export default async function (req: NextRequest) {
    const c = await cookies();
    const token = c.get('token')?.value;
    const user = token ? global._USERS?.[token] : undefined;

    if (!user) {
        return NextResponse.json({
            message: "احراز هویت نشده است",
            status: false,
        }, {status: 401});
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const redeem = body.redeem;

    if (!redeem) {
        return NextResponse.json({
            message: "کد فعالسازی وارد نشده است",
            status: false,
        }, {status: 400});
    }

    const validCodes: Record<string, string> = {
        "SAZEH-BASIC": "basic",
        "SAZEH-ADVANCED": "advanced",
        "SAZEH-PARTNER": "partner",
    };

    const plan = validCodes[redeem];
    if (!plan) {
        return NextResponse.json({
            message: "کد فعالسازی نامعتبر است",
            status: false,
        }, {status: 400});
    }

    user.plan = plan;
    return NextResponse.json({
        message: "اشتراک با موفقیت فعال شد",
        status: true,
        plan,
    });
}
