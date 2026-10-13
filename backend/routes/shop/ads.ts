import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method === "POST") {
        let user;
        try {
            user = await requireUser();
        } catch (e) {
            if (e instanceof AuthError) return authErrorResponse(e);
            throw e;
        }

        const body = await req.json().catch(() => ({})) as Record<string, any>;
        if (!body.shop_id || !body.title || !body.image_url) {
            return NextResponse.json({ message: "فروشگاه، عنوان و عکس الزامی است", status: false }, { status: 400 });
        }

        const shop = await prisma.shop.findFirst({ where: { id: body.shop_id, user_id: user.id } });
        if (!shop) {
            return NextResponse.json({ message: "فروشگاه شما یافت نشد", status: false }, { status: 404 });
        }

        const ad = await prisma.shopAd.create({
            data: {
                shop_id: body.shop_id,
                title: body.title,
                image_url: body.image_url,
                link_url: body.link_url || null,
                amount_paid: body.amount_paid ? parseInt(body.amount_paid) : 0,
                status: "pending",
                expires_at: body.expires_at ? new Date(body.expires_at) : null,
            },
        });
        return NextResponse.json({ message: "تبلیغ ثبت شد و پس از تایید مدیر فعال خواهد شد", status: true, ad });
    }

    const ads = await prisma.shopAd.findMany({
        where: {
            status: "active",
            OR: [
                { expires_at: null },
                { expires_at: { gt: new Date() } },
            ],
        },
        include: { shop: { select: { id: true, name: true, logo_url: true } } },
        orderBy: { amount_paid: "desc" },
        take: 10,
    });

    return NextResponse.json({ status: true, ads });
}
