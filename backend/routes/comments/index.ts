import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method === "GET") {
        const comments = await prisma.userComment.findMany({
            where: { status: "approved" },
            orderBy: { created_at: "desc" },
            take: 50,
        });
        return NextResponse.json({ comments, status: true });
    }

    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;

        if (!body.name || !body.text) {
            return NextResponse.json({
                message: "نام و متن نظر الزامی است",
                status: false,
            }, { status: 400 });
        }

        const rating = body.rating ? Math.min(5, Math.max(1, parseInt(body.rating))) : 5;

        const comment = await prisma.userComment.create({
            data: {
                name: body.name,
                phone: body.phone || null,
                text: body.text,
                rating,
                status: "pending",
            },
        });

        return NextResponse.json({
            message: "نظر شما ثبت شد و پس از تایید نمایش داده می‌شود",
            status: true,
            comment,
        });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
