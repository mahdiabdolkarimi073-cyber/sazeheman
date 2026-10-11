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

    return NextResponse.json({
        plans: {
            free: { price: 0, discount: 0 },
            basic: { price: 99000, discount: 0 },
            advanced: { price: 199000, discount: 10 },
            partner: { price: 499000, discount: 15 },
        },
        status: true,
    });
}
