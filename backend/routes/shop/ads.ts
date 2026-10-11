import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;
        if (!body.shop_id || !body.title || !body.image_url) {
            return NextResponse.json({ message: "فروشگاه، عنوان و عکس الزامی است", status: false }, { status: 400 });
        }
        const ad = await prisma.shopAd.create({
            data: {
                shop_id: body.shop_id,
                title: body.title,
                image_url: body.image_url,
                link_url: body.link_url || null,
                amount_paid: body.amount_paid ? parseInt(body.amount_paid) : 0,
                status: "active",
                expires_at: body.expires_at ? new Date(body.expires_at) : null,
            },
        });
        return NextResponse.json({ status: true, ad });
    }

    const ads = await prisma.shopAd.findMany({
        where: { status: "active" },
        include: { shop: { select: { id: true, name: true, logo_url: true } } },
        orderBy: { amount_paid: "desc" },
        take: 10,
    });

    return NextResponse.json({ status: true, ads });
}
