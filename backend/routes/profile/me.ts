import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser, AuthError, authErrorResponse, sanitizeUser} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    let user;
    try {
        user = await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;
        const data: Record<string, any> = {};
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.nickname !== undefined) data.nickname = body.nickname;
        if (body.first_name !== undefined) data.first_name = body.first_name;
        if (body.last_name !== undefined) data.last_name = body.last_name;
        if (body.email !== undefined) data.email = body.email;

        const updated = await prisma.user.update({
            where: { id: user.id },
            data,
        });
        return NextResponse.json({
            message: "به‌روزرسانی شد",
            status: true,
            user: sanitizeUser(updated),
        });
    }

    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
    return NextResponse.json({
        user: fullUser ? sanitizeUser(fullUser) : null,
        status: true,
    });
}
