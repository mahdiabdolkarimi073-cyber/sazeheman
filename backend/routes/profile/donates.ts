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

    const donates = [
        {
            id: 1,
            user_id: user.id,
            name: "نمونه",
            phone: "0912000000",
            description: "حمایت اول",
            type: "irt",
            amount: 100000,
            currency: "IRT",
            meta: {},
            is_visible: 1,
            is_blocked: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 1,
        },
    ];

    return NextResponse.json({
        donates,
        pages: 1,
        status: true,
    });
}
