import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {getRequestUser, requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";
import {Prisma} from "@prisma/client";

export default async function (req: NextRequest) {
    if (req.method === "GET") {
        const url = new URL(req.url);
        const q = (url.searchParams.get("q") || "").trim();
        const category = url.searchParams.get("category") || "";
        const city = (url.searchParams.get("city") || "").trim();
        const status = url.searchParams.get("status") || "open";
        const minPrice = url.searchParams.get("min_price");
        const maxPrice = url.searchParams.get("max_price");
        const hasBids = url.searchParams.get("has_bids"); // "yes" | "no"
        const sort = url.searchParams.get("sort") || "newest";
        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1") || 1);
        const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "12") || 12));
        const dashboardType = url.searchParams.get("dashboard_type");
        const my = url.searchParams.get("my");

        const where: Prisma.AuctionWhereInput = {};

        if (my === "true") {
            const currentUser = await getRequestUser();
            if (currentUser) {
                where.user_id = currentUser.id;
            }
            if (status === "open" || !status) {
                // show all statuses for owner
            } else if (status === "all") {
                where.status = { in: ["open", "closed", "awarded"] };
            } else {
                where.status = status;
            }
        } else if (status === "all") {
            where.status = { in: ["open", "closed", "awarded"] };
        } else if (status === "ending_soon") {
            where.status = "open";
            where.deadline = { gte: new Date(), lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) };
        } else {
            where.status = status;
        }

        if (dashboardType) where.dashboard_type = dashboardType;

        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { category: { contains: q, mode: "insensitive" } },
            ];
        }
        if (category) where.category = category;
        if (city) where.city = { contains: city, mode: "insensitive" };

        if (minPrice || maxPrice) {
            where.budget = {};
            if (minPrice) where.budget.gte = parseInt(minPrice);
            if (maxPrice) where.budget.lte = parseInt(maxPrice);
        }

        if (hasBids === "yes") where.bids = { some: {} };
        if (hasBids === "no") where.bids = { none: {} };

        let orderBy: Prisma.AuctionOrderByWithRelationInput = { created_at: "desc" };
        if (sort === "oldest") orderBy = { created_at: "asc" };
        else if (sort === "price_asc") orderBy = { budget: "asc" };
        else if (sort === "price_desc") orderBy = { budget: "desc" };
        else if (sort === "ending_soon") {
            orderBy = { deadline: "asc" };
            where.deadline = { gte: new Date() };
        }

        const [total, auctions] = await Promise.all([
            prisma.auction.count({ where }),
            prisma.auction.findMany({
                where,
                include: {
                    _count: { select: { bids: true } },
                    bids: { orderBy: { price: "asc" }, take: 1 },
                },
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);

        const safe = auctions.map((a) => {
            const lowest = a.bids[0];
            return {
                id: a.id,
                title: a.title,
                category: a.category,
                description: a.description,
                city: a.city,
                budget: a.budget,
                deadline: a.deadline ? a.deadline.toISOString() : null,
                status: a.status,
                created_at: a.created_at.toISOString(),
                bidsCount: a._count.bids,
                currentBid: lowest ? lowest.price : null,
            };
        });

        return NextResponse.json({
            auctions: safe,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            status: true,
        });
    }

    if (req.method === "POST") {
        let user;
        try {
            user = await requireUser();
        } catch (e) {
            if (e instanceof AuthError) return authErrorResponse(e);
            throw e;
        }

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
                user_id: user.id,
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
