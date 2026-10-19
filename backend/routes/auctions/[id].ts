import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getRequestUser, requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";

function computeMinIncrement(auction: { budget: number | null }): number {
    const base = auction.budget || 0;
    if (base <= 0) return 0;
    if (base < 1_000_000) return 50_000;
    if (base < 10_000_000) return 100_000;
    if (base < 100_000_000) return 500_000;
    return 1_000_000;
}

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1];

    if (req.method === "GET") {
        // Explicit column selection: the live database may not have the
        // winning_bid_id column yet (pending migration), so it must not be selected
        const auction = await prisma.auction.findUnique({
            where: { id },
            select: {
                id: true,
                user_id: true,
                title: true,
                category: true,
                description: true,
                phone: true,
                city: true,
                budget: true,
                deadline: true,
                status: true,
                created_at: true,
                updated_at: true,
                bids: { orderBy: { price: "asc" }, select: {
                    id: true,
                    user_id: true,
                    bidder_name: true,
                    price: true,
                    description: true,
                    created_at: true,
                } },
                user: { select: { id: true, nickname: true } },
            },
        });

        if (!auction) {
            return NextResponse.json({ message: "مزایده یافت نشد", status: false }, { status: 404 });
        }

        const currentUser = await getRequestUser();
        const isOwner = auction.user_id === currentUser?.id;
        const isAdmin = currentUser?.role === "admin";

        const minIncrement = computeMinIncrement(auction);
        const currentLowest = auction.bids[0]?.price ?? null;
        const winningBidIdOf = (a: Record<string, unknown>) => (typeof a.winning_bid_id === "string" ? a.winning_bid_id : null);
        const winningBidNameOf = (a: Record<string, unknown>, bids: { id: string; bidder_name: string }[]) =>
            (typeof a.winning_bid_id === "string" ? (bids.find((b) => b.id === a.winning_bid_id)?.bidder_name || null) : null);

        const safeBids = auction.bids.map((b) => ({
            id: b.id,
            bidder_name: b.bidder_name,
            price: b.price,
            description: isOwner ? b.description : (b.description ? "توضیحات ثبت شده" : null),
            created_at: b.created_at.toISOString(),
            is_own: b.user_id === currentUser?.id,
        }));

        const safeAuction = {
            id: auction.id,
            title: auction.title,
            category: auction.category,
            description: auction.description,
            city: auction.city,
            budget: auction.budget,
            deadline: auction.deadline ? auction.deadline.toISOString() : null,
            status: auction.status,
            created_at: auction.created_at.toISOString(),
            updated_at: auction.updated_at.toISOString(),
            bidsCount: auction.bids.length,
            currentBid: currentLowest,
            minIncrement,
            isOwner,
            isAdmin,
            ownerNickname: auction.user?.nickname || null,
            phone: isOwner || isAdmin ? auction.phone : undefined,
            winningBidId: winningBidIdOf(auction),
            winningBidName: winningBidNameOf(auction, auction.bids),
        };

        return NextResponse.json({ auction: safeAuction, bids: safeBids, status: true });
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

        const price = parseInt(body.price);
        if (isNaN(price) || price <= 0) {
            return NextResponse.json({ message: "قیمت نامعتبر است", status: false }, { status: 400 });
        }

        // Explicit column selection: the live database may not have the
        // winning_bid_id column yet (pending migration), so it must not be selected
        const auction = await prisma.auction.findUnique({
            where: { id },
            select: {
                user_id: true,
                budget: true,
                deadline: true,
                status: true,
            },
        });
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

        const minIncrement = computeMinIncrement(auction);

        const existingBids = await prisma.auctionBid.findMany({
            where: { auction_id: id },
            orderBy: { price: "asc" },
        });

        const currentLowest = existingBids[0]?.price ?? null;
        const myExistingBid = existingBids.find((b) => b.user_id === user.id);

        if (currentLowest !== null && price >= currentLowest) {
            return NextResponse.json({
                message: `قیمت پیشنهادی باید کمتر از کمترین پیشنهاد فعلی (${Number(currentLowest).toLocaleString('fa')} تومان) باشد`,
                status: false,
            }, { status: 400 });
        }

        if (auction.budget && price >= auction.budget) {
            return NextResponse.json({
                message: `قیمت پیشنهادی باید کمتر از بودجه پایه (${Number(auction.budget).toLocaleString('fa')} تومان) باشد`,
                status: false,
            }, { status: 400 });
        }

        if (currentLowest !== null && (currentLowest - price) < minIncrement) {
            return NextResponse.json({
                message: `حداقل کاهش قیمت نسبت به کمترین پیشنهاد ${minIncrement.toLocaleString('fa')} تومان است`,
                status: false,
            }, { status: 400 });
        }

        if (myExistingBid) {
            if (price >= myExistingBid.price) {
                return NextResponse.json({
                    message: "قیمت جدید باید کمتر از پیشنهاد قبلی شما باشد",
                    status: false,
                }, { status: 400 });
            }
            const bid = await prisma.auctionBid.update({
                where: { id: myExistingBid.id },
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
        let user;
        try {
            user = await requireUser();
        } catch (e) {
            if (e instanceof AuthError) return authErrorResponse(e);
            throw e;
        }

        const body = await req.json().catch(() => ({})) as Record<string, any>;

        // Explicit column selection: the live database may not have the
        // winning_bid_id column yet (pending migration), so it must not be selected
        const auction = await prisma.auction.findUnique({
            where: { id },
            select: {
                user_id: true,
                title: true,
                deadline: true,
                status: true,
            },
        });
        if (!auction) {
            return NextResponse.json({ message: "مزایده یافت نشد", status: false }, { status: 404 });
        }

        const isOwner = auction.user_id === user.id;
        const isAdmin = user.role === "admin";

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

            if (auction.status === "awarded") {
                return NextResponse.json({ message: "برنده قبلاً انتخاب شده است", status: false }, { status: 400 });
            }

            const bid = await prisma.auctionBid.findFirst({ where: { id: bidId, auction_id: id } });
            if (!bid) {
                return NextResponse.json({ message: "پیشنهاد یافت نشد", status: false }, { status: 404 });
            }

            // The live database may not have the winning_bid_id column yet
            // (pending migration); retry without it if the first write fails
            const runAward = async (withColumn: boolean) => prisma.$transaction(async (tx) => {
                const locked = await tx.auction.findUnique({ where: { id } });
                if (!locked || locked.status === "awarded") {
                    throw new Error("awarded");
                }
                return await tx.auction.update({
                    where: { id },
                    data: withColumn ? { status: "awarded", winning_bid_id: bidId } : { status: "awarded" },
                });
            });

            const result = await runAward(true)
                .catch((e) => {
                    if (e.message === "awarded") throw e;
                    return runAward(false);
                })
                .catch((e) => {
                    if (e.message === "awarded") return null;
                    throw e;
                })
                .then((updated) => updated ? { updated, bid } : null);

            if (!result) {
                return NextResponse.json({ message: "برنده قبلاً انتخاب شده است", status: false }, { status: 400 });
            }

            if (auction.user_id) {
                await prisma.userNotification.create({
                    data: {
                        user_id: auction.user_id,
                        title: "برنده مزایده انتخاب شد",
                        description: `برنده مزایده «${auction.title}» انتخاب شد.`,
                    },
                }).catch(() => {});
            }
            if (bid.user_id) {
                await prisma.userNotification.create({
                    data: {
                        user_id: bid.user_id,
                        title: "پیشنهاد شما برنده شد",
                        description: `پیشنهاد شما در مزایده «${auction.title}» برنده شد.`,
                    },
                }).catch(() => {});
            }

            return NextResponse.json({
                message: "برنده انتخاب شد",
                status: true,
                auction: result.updated,
                winning_bid: result.bid,
            });
        }

        if (body.action === "edit" && body.fields) {
            if (!isOwner && !isAdmin) {
                return NextResponse.json({ message: "فقط ایجادکننده می‌تواند مزایده را ویرایش کند", status: false }, { status: 403 });
            }
            const f = body.fields;
            const data: Record<string, any> = {};
            if (f.title) data.title = f.title;
            if (f.category) data.category = f.category;
            if (f.description !== undefined) data.description = f.description;
            if (f.city !== undefined) data.city = f.city;
            if (f.budget !== undefined) data.budget = f.budget ? parseInt(f.budget) : null;
            if (f.deadline !== undefined) data.deadline = f.deadline ? new Date(f.deadline) : null;

            const updated = await prisma.auction.update({ where: { id }, data });
            return NextResponse.json({ message: "مزایده به‌روزرسانی شد", status: true, auction: updated });
        }

        if (body.action === "delete") {
            if (!isOwner && !isAdmin) {
                return NextResponse.json({ message: "فقط ایجادکننده می‌تواند مزایده را حذف کند", status: false }, { status: 403 });
            }
            await prisma.auction.delete({ where: { id } });
            return NextResponse.json({ message: "مزایده حذف شد", status: true });
        }

        return NextResponse.json({ message: "عمل نامعتبر", status: false }, { status: 400 });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
