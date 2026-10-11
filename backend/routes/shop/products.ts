import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function (req: NextRequest) {
    const c = await cookies();
    const token = c.get('token')?.value;
    const user = token ? global._USERS?.[token] : undefined;

    if (!user) {
        return NextResponse.json({ message: "احراز هویت نشده است", status: false }, { status: 401 });
    }

    const shop = await prisma.shop.findFirst({ where: { owner_phone: user.phone } });
    if (!shop) {
        return NextResponse.json({ message: "فروشگاه شما یافت نشد", status: false }, { status: 404 });
    }

    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;
        if (!body.name || body.price === undefined) {
            return NextResponse.json({ message: "نام و قیمت محصول الزامی است", status: false }, { status: 400 });
        }
        const product = await prisma.product.create({
            data: {
                shop_id: shop.id,
                category_id: body.category_id || null,
                name: body.name,
                description: body.description || null,
                price: parseInt(body.price),
                image_url: body.image_url || null,
                stock: body.stock ? parseInt(body.stock) : 0,
                status: "active",
            },
        });
        return NextResponse.json({ status: true, product });
    }

    if (req.method === "DELETE") {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ message: "شناسه محصول الزامی است", status: false }, { status: 400 });
        }
        await prisma.product.deleteMany({ where: { id, shop_id: shop.id } });
        return NextResponse.json({ status: true });
    }

    if (req.method === "PUT") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;
        const id = body.id;
        if (!id) {
            return NextResponse.json({ message: "شناسه محصول الزامی است", status: false }, { status: 400 });
        }
        const product = await prisma.product.updateMany({
            where: { id, shop_id: shop.id },
            data: {
                name: body.name,
                description: body.description,
                price: body.price ? parseInt(body.price) : undefined,
                image_url: body.image_url,
                stock: body.stock ? parseInt(body.stock) : undefined,
                category_id: body.category_id,
            },
        });
        return NextResponse.json({ status: true, product });
    }

    const products = await prisma.product.findMany({
        where: { shop_id: shop.id },
        include: { category: true },
        orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ status: true, products, shop });
}
