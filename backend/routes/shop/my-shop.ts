import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";

async function getOrCreateShop(userId: string, userPhone: string) {
    const existing = await prisma.shop.findFirst({ where: { user_id: userId } });
    if (existing) return existing;

    return prisma.shop.create({
        data: {
            name: "فروشگاه من",
            owner_phone: userPhone,
            user_id: userId,
            dashboard_type: "sazeheman",
        },
    });
}

export default async function (req: NextRequest) {
    let user;
    try {
        user = await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    const shop = await getOrCreateShop(user.id, user.phone);

    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;
        const updated = await prisma.shop.update({
            where: { id: shop.id },
            data: {
                name: body.name || shop.name,
                description: body.description ?? shop.description,
                logo_url: body.logo_url ?? shop.logo_url,
                banner_url: body.banner_url ?? shop.banner_url,
            },
        });
        return NextResponse.json({ status: true, shop: updated });
    }

    return NextResponse.json({ status: true, shop });
}
