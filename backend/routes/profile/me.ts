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

    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;
        if (body.slug) user.slug = body.slug;
        if (body.nickname) user.nickname = body.nickname;
        if (body.first_name) user.first_name = body.first_name;
        if (body.last_name) user.last_name = body.last_name;
        if (body.email) user.email = body.email;
        if (body.phone) user.phone = body.phone;
        return NextResponse.json({
            message: "به‌روزرسانی شد",
            status: true,
            user,
        });
    }

    return NextResponse.json({
        user,
        status: true,
    });
}
