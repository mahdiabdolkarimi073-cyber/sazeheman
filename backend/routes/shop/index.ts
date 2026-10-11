import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const categoryId = url.searchParams.get("category_id");
    const shopId = url.searchParams.get("shop_id");
    const page = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(url.searchParams.get("per_page") || "20");

    const where: any = { status: "active" };
    if (search) {
        where.name = { contains: search };
    }
    if (categoryId) {
        where.category_id = categoryId;
    }
    if (shopId) {
        where.shop_id = shopId;
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                shop: { select: { id: true, name: true, logo_url: true } },
                category: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { created_at: "desc" },
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.product.count({ where }),
    ]);

    return NextResponse.json({
        status: true,
        products,
        total,
        page,
        per_page: perPage,
    });
}
