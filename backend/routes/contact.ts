import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireAdmin, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method === "GET") {
        try {
            await requireAdmin();
        } catch (e) {
            if (e instanceof AuthError) return authErrorResponse(e);
            throw e;
        }
        const messages = await prisma.contactMessage.findMany({
            orderBy: { created_at: "desc" },
            take: 100,
        });
        return NextResponse.json({ messages, status: true });
    }

    if (req.method !== "POST") {
        return NextResponse.json({
            message: "Method Not Allowed",
            status: false,
        }, {status: 405});
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;

    if (!body.name || !body.message) {
        return NextResponse.json({
            message: "نام و متن پیام الزامی است",
            status: false,
            errors: {
                name: !body.name ? ["این فیلد الزامی است"] : [],
                message: !body.message ? ["این فیلد الزامی است"] : [],
            },
        }, {status: 400});
    }

    await prisma.contactMessage.create({
        data: {
            name: body.name,
            last_name: body.last_name || null,
            email: body.email || null,
            phone: body.phone || null,
            message: body.message,
        },
    });

    return NextResponse.json({
        message: "درخواست شما با موفقیت ثبت شد",
        status: true,
    });
}
