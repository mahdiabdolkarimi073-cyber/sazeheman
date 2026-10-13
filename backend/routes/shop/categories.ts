import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireAdmin, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method === "POST") {
        try {
            await requireAdmin();
        } catch (e) {
            if (e instanceof AuthError) return authErrorResponse(e);
            throw e;
        }

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

    if (req.method === "DELETE") {
        try {
            await requireAdmin();
        } catch (e) {
            if (e instanceof AuthError) return authErrorResponse(e);
            throw e;
        }

        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ message: "شناسه دسته الزامی است", status: false }, { status: 400 });
        }
        await prisma.productCategory.delete({ where: { id } }).catch(() => null);
        return NextResponse.json({ status: true });
    }

    const categories = await prisma.productCategory.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
    });

    return NextResponse.json({ status: true, categories });
}
