import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AuctionsClient from "./AuctionsClient";

export const metadata: Metadata = {
    title: "مزایده‌های ساختمانی — سازه‌همان",
    description: "مزایده‌های فعال و پایان‌یافته صنعت ساختمان را مشاهده و در آن‌ها شرکت کنید.",
};

export const dynamic = "force-dynamic";

export default async function AuctionsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const sp = (key: string) => {
        const v = searchParams[key];
        return Array.isArray(v) ? v[0] : v;
    };

    const q = (sp("q") || "").trim();
    const category = sp("category") || "";
    const city = (sp("city") || "").trim();
    const status = sp("status") || "open";
    const minPrice = sp("min_price") || "";
    const maxPrice = sp("max_price") || "";
    const hasBids = sp("has_bids") || "";
    const sort = sp("sort") || "newest";
    const pageStr = sp("page") || "1";
    const page = Math.max(1, parseInt(pageStr) || 1);

    const [categories, cities] = await Promise.all([
        prisma.auction.findMany({
            where: { category: { not: "" } },
            select: { category: true },
            distinct: ["category"],
        }).then((rows) => rows.map((r) => r.category)).catch(() => []),
        prisma.auction.findMany({
            where: { city: { not: null } },
            select: { city: true },
            distinct: ["city"],
        }).then((rows) => rows.map((r) => r.city).filter(Boolean) as string[]).catch(() => []),
    ]);

    return (
        <AuctionsClient
            initialCategories={categories}
            initialCities={cities}
            initialFilters={{
                q,
                category,
                city,
                status,
                min_price: minPrice,
                max_price: maxPrice,
                has_bids: hasBids,
                sort,
                page,
            }}
        />
    );
}
