import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getRequestUser} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method === "GET") {
        const url = new URL(req.url);
        const dashboardType = url.searchParams.get("dashboard_type");
        const status = url.searchParams.get("status") || "open";

        const auctions = await prisma.auction.findMany({
            where: {
                status,
                ...(dashboardType ? { dashboard_type: dashboardType } : {}),
            },
            include: { bids: true, user: { select: { id: true, nickname: true } } },
            orderBy: { created_at: "desc" },
            take: 50,
        });
        return NextResponse.json({ auctions, status: true });
    }

    if (req.method === "POST") {
        const currentUser = await getRequestUser();
        const body = await req.json().catch(() => ({})) as Record<string, any>;

        const required = ["title", "category", "phone"];
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json({
                    message: `${field} الزامی است`,
                    status: false,
                }, { status: 400 });
            }
        }

        const deadline = body.deadline ? new Date(body.deadline) : null;
        if (deadline && deadline < new Date()) {
            return NextResponse.json({
                message: "مهلت مزایده نمی‌تواند در گذشته باشد",
                status: false,
            }, { status: 400 });
        }

        const auction = await prisma.auction.create({
            data: {
                user_id: currentUser?.id || null,
                title: body.title,
                category: body.category,
                description: body.description || null,
                phone: body.phone,
                city: body.city || null,
                budget: body.budget ? parseInt(body.budget) : null,
                deadline,
                dashboard_type: body.dashboard_type || "sazeheman",
                status: "open",
            },
        });

        return NextResponse.json({
            message: "مزایده با موفقیت ثبت شد",
            status: true,
            auction,
        });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
