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

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("per_page") || "20");

    const payments = await prisma.payment.findMany({
        where: { user_id: user.id },
        orderBy: { created_at: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
    });

    const total = await prisma.payment.count({
        where: { user_id: user.id },
    });

    return NextResponse.json({
        donates: payments.map(p => ({
            id: p.id,
            user_id: p.user_id,
            description: p.description,
            type: p.gateway,
            amount: p.amount,
            currency: "IRT",
            status: p.status,
            tracking_id: p.tracking_id,
            created_at: p.created_at.toISOString(),
            updated_at: p.created_at.toISOString(),
        })),
        pages: Math.ceil(total / perPage) || 1,
        total,
        status: true,
    });
}
