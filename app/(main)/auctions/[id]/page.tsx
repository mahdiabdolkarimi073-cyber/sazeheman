import { Metadata } from "next";
import NotFound from "@/app/not-found";
import { prisma } from "@/lib/prisma";
import AuctionDetailClient from "./AuctionDetailClient";

export const metadata: Metadata = {
    title: "جزئیات مزایده — سازه‌همان",
};

export const dynamic = "force-dynamic";

export default async function AuctionDetailPage({
    params,
}: {
    params: { id: string };
}) {
    // Explicit column selection: the live database may not have the
    // winning_bid_id column yet (pending migration), so it must not be selected
    const auction = await prisma.auction.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            title: true,
            category: true,
            description: true,
            city: true,
            budget: true,
            deadline: true,
            status: true,
            created_at: true,
            _count: { select: { bids: true } },
            bids: { orderBy: { price: "asc" }, select: { price: true } },
        },
    });

    if (!auction) {
        return <NotFound />;
    }

    const initialData = {
        id: auction.id,
        title: auction.title,
        category: auction.category,
        description: auction.description,
        city: auction.city,
        budget: auction.budget,
        deadline: auction.deadline ? auction.deadline.toISOString() : null,
        status: auction.status,
        created_at: auction.created_at.toISOString(),
        bidsCount: auction._count.bids,
        currentBid: auction.bids[0]?.price ?? null,
    };

    return <AuctionDetailClient auctionId={params.id} initialData={initialData} />;
}
