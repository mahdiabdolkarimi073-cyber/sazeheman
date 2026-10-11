import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const name = url.searchParams.get("name") || "";

    if (!name) {
        return NextResponse.json({ message: "نام محصول الزامی است", status: false }, { status: 400 });
    }

    const products = await prisma.product.findMany({
        where: {
            name: { contains: name },
            status: "active",
        },
        include: {
            shop: { select: { id: true, name: true, logo_url: true } },
        },
        orderBy: { price: "asc" },
        take: 20,
    });

    return NextResponse.json({ status: true, products });
}
