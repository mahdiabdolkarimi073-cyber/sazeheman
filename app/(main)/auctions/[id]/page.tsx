import { Metadata } from "next";
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
    const auction = await prisma.auction.findUnique({
        where: { id: params.id },
        include: {
            _count: { select: { bids: true } },
            bids: { orderBy: { price: "asc" } },
        },
    });

    if (!auction) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="text-xl font-bold text-[#252C2A] mb-3">مزایده یافت نشد</h1>
                <p className="text-sm text-[#6B7771] mb-6">این مزایده وجود ندارد یا حذف شده است.</p>
                <a href="/auctions" className="text-primary text-sm hover:underline">بازگشت به لیست مزایده‌ها</a>
            </div>
        );
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
