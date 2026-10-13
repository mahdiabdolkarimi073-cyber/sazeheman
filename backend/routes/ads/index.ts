import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireAdmin, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method === "GET") {
        const url = new URL(req.url);
        const adminOnly = url.searchParams.get("admin") === "true";

        if (adminOnly) {
            try {
                await requireAdmin();
            } catch (e) {
                if (e instanceof AuthError) return authErrorResponse(e);
                throw e;
            }
            const ads = await prisma.advertisement.findMany({
                orderBy: { created_at: "desc" },
                take: 100,
            });
            return NextResponse.json({ ads, status: true });
        }

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
                status: "pending",
                starts_at: body.starts_at ? new Date(body.starts_at) : new Date(),
                expires_at: body.expires_at ? new Date(body.expires_at) : null,
            },
        });

        return NextResponse.json({
            message: "تبلیغ با موفقیت ثبت شد و پس از تایید مدیر فعال خواهد شد",
            status: true,
            ad,
        });
    }

    if (req.method === "PUT") {
        try {
            await requireAdmin();
        } catch (e) {
            if (e instanceof AuthError) return authErrorResponse(e);
            throw e;
        }

        const body = await req.json().catch(() => ({})) as Record<string, any>;
        const id = body.id;
        const action = body.action;

        if (!id || !action) {
            return NextResponse.json({ message: "id و action الزامی است", status: false }, { status: 400 });
        }

        const newStatus = action === "approve" ? "active" : action === "reject" ? "rejected" : null;
        if (!newStatus) {
            return NextResponse.json({ message: "action باید approve یا reject باشد", status: false }, { status: 400 });
        }

        const ad = await prisma.advertisement.update({
            where: { id },
            data: { status: newStatus },
        });

        return NextResponse.json({
            message: action === "approve" ? "تبلیغ تایید شد" : "تبلیغ رد شد",
            status: true,
            ad,
        });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
