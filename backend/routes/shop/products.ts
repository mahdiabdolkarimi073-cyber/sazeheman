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

    const shop = await prisma.shop.findFirst({ where: { user_id: user.id } });
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
        const data: Record<string, any> = {};
        if (body.name !== undefined) data.name = body.name;
        if (body.description !== undefined) data.description = body.description;
        if (body.price !== undefined) data.price = parseInt(body.price);
        if (body.image_url !== undefined) data.image_url = body.image_url;
        if (body.stock !== undefined) data.stock = parseInt(body.stock);
        if (body.category_id !== undefined) data.category_id = body.category_id;

        const product = await prisma.product.updateMany({
            where: { id, shop_id: shop.id },
            data,
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
