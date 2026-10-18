import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

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

    return NextResponse.json({
        categories,
        cities,
        status: true,
    });
}
