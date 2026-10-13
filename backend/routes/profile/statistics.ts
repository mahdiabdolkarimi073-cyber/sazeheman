import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    let user;
    try {
        user = await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    const [projects, businesses, auctions, products, activeSub] = await Promise.all([
        prisma.constructionProject.count({ where: { user_id: user.id } }),
        prisma.business.count({ where: { user_id: user.id } }),
        prisma.auction.count({ where: { user_id: user.id, status: "open" } }),
        prisma.shop.count({ where: { user_id: user.id } }),
        prisma.subscription.findFirst({
            where: {
                user_id: user.id,
                status: { in: ["trial", "active"] },
                expires_at: { gt: new Date() },
            },
        }),
    ]);

    return NextResponse.json({
        statistics: {
            projects,
            businesses,
            open_auctions: auctions,
            shops: products,
            has_active_subscription: !!activeSub,
            subscription_status: activeSub?.status || "none",
            subscription_expires: activeSub?.expires_at?.toISOString() || null,
        },
        status: true,
    });
}
