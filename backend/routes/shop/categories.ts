import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;
        if (!body.name) {
            return NextResponse.json({ message: "نام دسته الزامی است", status: false }, { status: 400 });
        }
        const slug = body.slug || body.name.toString().trim().replace(/\s+/g, "-");

        const category = await prisma.productCategory.create({
            data: { name: body.name, slug, icon: body.icon || null },
        }).catch(() => null);

        if (!category) {
            return NextResponse.json({ message: "این دسته قبلا ثبت شده", status: false }, { status: 400 });
        }
        return NextResponse.json({ status: true, category });
    }

    const categories = await prisma.productCategory.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
    });

    return NextResponse.json({ status: true, categories });
}
