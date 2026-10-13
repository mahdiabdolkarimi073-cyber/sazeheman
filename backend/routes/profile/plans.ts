import {NextRequest, NextResponse} from "next/server";
import {requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    try {
        await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    return NextResponse.json({
        plans: {
            free: { price: 0, discount: 0, name: "پایه", trial_days: 2 },
            basic: { price: 99000, discount: 0, name: "حرفه‌ای", trial_days: 0 },
            advanced: { price: 199000, discount: 10, name: "ویژه", trial_days: 0 },
            partner: { price: 499000, discount: 15, name: "شراکت", trial_days: 0 },
        },
        status: true,
    });
}
