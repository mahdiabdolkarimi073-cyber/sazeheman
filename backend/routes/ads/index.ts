import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method === "GET") {
        const ads = await prisma.advertisement.findMany({
            where: {
                status: "active",
                OR: [
                    { expires_at: null },
                    { expires_at: { gt: new Date() } }
                ]
            },
            orderBy: { created_at: "desc" },
            take: 20,
        });
        return NextResponse.json({ ads, status: true });
    }

    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;

        const required = ["business_name", "title", "media_url", "media_type"];
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json({
                    message: `${field} الزامی است`,
                    status: false,
                }, { status: 400 });
            }
        }

        if (body.media_type === "video" && body.media_duration && body.media_duration > 30) {
            return NextResponse.json({
                message: "حداکثر مدت ویدیو ۳۰ ثانیه است",
                status: false,
            }, { status: 400 });
        }

        const ad = await prisma.advertisement.create({
            data: {
                business_name: body.business_name,
                title: body.title,
                description: body.description || null,
                media_url: body.media_url,
                media_type: body.media_type,
                link_url: body.link_url || null,
                phone: body.phone || null,
                amount_paid: body.amount_paid ? parseInt(body.amount_paid) : 0,
                status: "active",
                expires_at: body.expires_at ? new Date(body.expires_at) : null,
            },
        });

        return NextResponse.json({
            message: "تبلیغ با موفقیت ثبت شد",
            status: true,
            ad,
        });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
