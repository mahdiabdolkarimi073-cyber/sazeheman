import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1];

    if (req.method === "GET") {
        const auction = await prisma.auction.findUnique({
            where: { id },
            include: { bids: { orderBy: { price: "asc" } } },
        });

        if (!auction) {
            return NextResponse.json({ message: "مزایده یافت نشد", status: false }, { status: 404 });
        }

        return NextResponse.json({ auction, status: true });
    }

    if (req.method === "POST") {
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

        const bid = await prisma.auctionBid.create({
            data: {
                auction_id: id,
                bidder_name: body.bidder_name,
                phone: body.phone,
                price: parseInt(body.price),
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
        const body = await req.json().catch(() => ({})) as Record<string, any>;

        if (body.action === "close") {
            const auction = await prisma.auction.update({
                where: { id },
                data: { status: "closed" },
            });
            return NextResponse.json({
                message: "مزایده بسته شد",
                status: true,
                auction,
            });
        }

        return NextResponse.json({ message: "عمل نامعتبر", status: false }, { status: 400 });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
