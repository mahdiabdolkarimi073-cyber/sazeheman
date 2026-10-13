import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";

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
        const id = body.id;
        if (!id) {
            return NextResponse.json({ message: "شناسه اعلان الزامی است", status: false }, { status: 400 });
        }
        await prisma.userNotification.updateMany({
            where: { id, user_id: user.id },
            data: { is_read: true },
        });
        return NextResponse.json({ status: true });
    }

    const url = new URL(req.url);
    const onlyUnread = url.searchParams.get("unread") === "true";

    const notifications = await prisma.userNotification.findMany({
        where: {
            user_id: user.id,
            ...(onlyUnread ? { is_read: false } : {}),
        },
        orderBy: { created_at: "desc" },
        take: 50,
    });

    const unreadCount = await prisma.userNotification.count({
        where: { user_id: user.id, is_read: false },
    });

    return NextResponse.json({
        notifications,
        unread_count: unreadCount,
        status: true,
    });
}
