import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getRequestUser, requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1];

    if (req.method === "GET") {
        const auction = await prisma.auction.findUnique({
            where: { id },
            include: { bids: { orderBy: { price: "asc" } }, user: { select: { id: true, nickname: true } } },
        });

        if (!auction) {
            return NextResponse.json({ message: "مزایده یافت نشد", status: false }, { status: 404 });
        }

        const safeAuction = {
            ...auction,
            phone: auction.phone,
            user_phone: undefined,
        };

        return NextResponse.json({ auction: safeAuction, status: true });
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

        const required = ["bidder_name", "phone", "price"];
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json({
                    message: `${field} الزامی است`,
                    status: false,
                }, { status: 400 });
            }
        }

        const auction = await prisma.auction.findUnique({ where: { id } });
        if (!auction) {
            return NextResponse.json({ message: "مزایده یافت نشد", status: false }, { status: 404 });
        }
        if (auction.status !== "open") {
            return NextResponse.json({ message: "این مزایده بسته شده است", status: false }, { status: 400 });
        }

        if (auction.deadline && auction.deadline < new Date()) {
            await prisma.auction.update({
                where: { id },
                data: { status: "closed" },
            });
            return NextResponse.json({ message: "مهلت این مزایده به پایان رسیده است", status: false }, { status: 400 });
        }

        if (auction.user_id === user.id) {
            return NextResponse.json({ message: "شما نمی‌توانید در مزایده خود پیشنهاد ثبت کنید", status: false }, { status: 400 });
        }

        const price = parseInt(body.price);
        if (isNaN(price) || price <= 0) {
            return NextResponse.json({ message: "قیمت نامعتبر است", status: false }, { status: 400 });
        }

        const existingBid = await prisma.auctionBid.findFirst({
            where: { auction_id: id, user_id: user.id },
        });

        if (existingBid) {
            const bid = await prisma.auctionBid.update({
                where: { id: existingBid.id },
                data: {
                    price,
                    bidder_name: body.bidder_name,
                    description: body.description || null,
                },
            });
            return NextResponse.json({
                message: "پیشنهاد شما به‌روزرسانی شد",
                status: true,
                bid,
            });
        }

        const bid = await prisma.auctionBid.create({
            data: {
                auction_id: id,
                user_id: user.id,
                bidder_name: body.bidder_name,
                phone: body.phone,
                price,
                description: body.description || null,
            },
        });

        return NextResponse.json({
            message: "پیشنهاد قیمت شما ثبت شد",
            status: true,
            bid,
        });
    }

    if (req.method === "PUT") {
        const currentUser = await getRequestUser();
        const body = await req.json().catch(() => ({})) as Record<string, any>;

        const auction = await prisma.auction.findUnique({ where: { id } });
        if (!auction) {
            return NextResponse.json({ message: "مزایده یافت نشد", status: false }, { status: 404 });
        }

        const isOwner = auction.user_id === currentUser?.id;
        const isAdmin = currentUser?.role === "admin";

        if (body.action === "close") {
            if (!isOwner && !isAdmin) {
                return NextResponse.json({ message: "فقط ایجادکننده یا مدیر می‌تواند مزایده را ببندد", status: false }, { status: 403 });
            }
            const updated = await prisma.auction.update({
                where: { id },
                data: { status: "closed" },
            });
            return NextResponse.json({ message: "مزایده بسته شد", status: true, auction: updated });
        }

        if (body.action === "award") {
            if (!isOwner && !isAdmin) {
                return NextResponse.json({ message: "فقط ایجادکننده یا مدیر می‌تواند برنده را انتخاب کند", status: false }, { status: 403 });
            }
            const bidId = body.bid_id;
            if (!bidId) {
                return NextResponse.json({ message: "bid_id الزامی است", status: false }, { status: 400 });
            }

            const bid = await prisma.auctionBid.findFirst({ where: { id: bidId, auction_id: id } });
            if (!bid) {
                return NextResponse.json({ message: "پیشنهاد یافت نشد", status: false }, { status: 404 });
            }

            const updated = await prisma.auction.update({
                where: { id },
                data: { status: "awarded" },
            });

            return NextResponse.json({
                message: "برنده انتخاب شد",
                status: true,
                auction: updated,
                winning_bid: bid,
            });
        }

        return NextResponse.json({ message: "عمل نامعتبر", status: false }, { status: 400 });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
