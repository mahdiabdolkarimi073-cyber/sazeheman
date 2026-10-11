import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function getOrCreateShop(userPhone: string) {
    const existing = await prisma.shop.findFirst({ where: { owner_phone: userPhone } });
    if (existing) return existing;

    return prisma.shop.create({
        data: {
            name: "فروشگاه من",
            owner_phone: userPhone,
            dashboard_type: "sazeheman",
        },
    });
}

export default async function (req: NextRequest) {
    const c = await cookies();
    const token = c.get('token')?.value;
    const user = token ? global._USERS?.[token] : undefined;

    if (!user) {
        return NextResponse.json({ message: "احراز هویت نشده است", status: false }, { status: 401 });
    }

    const shop = await getOrCreateShop(user.phone);

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
