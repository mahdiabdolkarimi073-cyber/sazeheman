import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireAdmin, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    let admin;
    try {
        admin = await requireAdmin();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    if (req.method === "GET") {
        const url = new URL(req.url);
        const section = url.searchParams.get("section");

        if (section === "users") {
            const search = url.searchParams.get("search") || "";
            const where: any = {};
            if (search) {
                where.OR = [
                    { phone: { contains: search } },
                    { nickname: { contains: search } },
                    { first_name: { contains: search } },
                    { last_name: { contains: search } },
                    { email: { contains: search } },
                ];
            }
            const users = await prisma.user.findMany({
                where,
                select: {
                    id: true, phone: true, role: true, account_type: true,
                    nickname: true, first_name: true, last_name: true, email: true,
                    plan: true, status: true, trial_used: true, created_at: true,
                    _count: { select: { projects: true, businesses: true } },
                },
                orderBy: { created_at: "desc" },
                take: 100,
            });
            return NextResponse.json({ users, status: true });
        }

        if (section === "businesses") {
            const businesses = await prisma.business.findMany({
                orderBy: { created_at: "desc" },
                include: { job: { select: { name: true } }, photos: true },
                take: 100,
            });
            return NextResponse.json({ businesses, status: true });
        }

        if (section === "payments") {
            const payments = await prisma.payment.findMany({
                orderBy: { created_at: "desc" },
                include: { user: { select: { id: true, phone: true, nickname: true } } },
                take: 100,
            });
            return NextResponse.json({ payments, status: true });
        }

        if (section === "subscriptions") {
            const subs = await prisma.subscription.findMany({
                orderBy: { created_at: "desc" },
                include: { user: { select: { id: true, phone: true, nickname: true } } },
                take: 100,
            });
            return NextResponse.json({ subscriptions: subs, status: true });
        }

        if (section === "stats") {
            const [users, projects, businesses, auctions, shops, tickets, ads, comments, payments] = await Promise.all([
                prisma.user.count(),
                prisma.constructionProject.count(),
                prisma.business.count(),
                prisma.auction.count(),
                prisma.shop.count(),
                prisma.supportTicket.count(),
                prisma.advertisement.count(),
                prisma.userComment.count(),
                prisma.payment.count(),
            ]);

            const pendingProjects = await prisma.constructionProject.count({ where: { status: "pending" } });
            const pendingBusinesses = await prisma.business.count({ where: { status: "pending" } });
            const pendingAds = await prisma.advertisement.count({ where: { status: "pending" } });
            const pendingComments = await prisma.userComment.count({ where: { status: "pending" } });
            const openTickets = await prisma.supportTicket.count({ where: { status: "open" } });

            return NextResponse.json({
                stats: {
                    users, projects, businesses, auctions, shops, tickets, ads, comments, payments,
                    pending: {
                        projects: pendingProjects,
                        businesses: pendingBusinesses,
                        ads: pendingAds,
                        comments: pendingComments,
                        tickets: openTickets,
                    },
                },
                status: true,
            });
        }

        return NextResponse.json({ message: "section نامعتبر است", status: false }, { status: 400 });
    }

    if (req.method === "PUT") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;
        const action = body.action;

        if (action === "set_role") {
            const userId = body.user_id;
            const role = body.role;
            if (!userId || !role) {
                return NextResponse.json({ message: "user_id و role الزامی است", status: false }, { status: 400 });
            }
            if (role !== "admin" && role !== "user") {
                return NextResponse.json({ message: "role باید admin یا user باشد", status: false }, { status: 400 });
            }
            await prisma.user.update({ where: { id: userId }, data: { role } });
            return NextResponse.json({ status: true });
        }

        if (action === "suspend_user") {
            const userId = body.user_id;
            if (!userId) {
                return NextResponse.json({ message: "user_id الزامی است", status: false }, { status: 400 });
            }
            await prisma.user.update({ where: { id: userId }, data: { status: "suspended" } });
            return NextResponse.json({ status: true });
        }

        if (action === "activate_user") {
            const userId = body.user_id;
            if (!userId) {
                return NextResponse.json({ message: "user_id الزامی است", status: false }, { status: 400 });
            }
            await prisma.user.update({ where: { id: userId }, data: { status: "active" } });
            return NextResponse.json({ status: true });
        }

        return NextResponse.json({ message: "action نامعتبر است", status: false }, { status: 400 });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
