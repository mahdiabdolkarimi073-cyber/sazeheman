import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    const jobs = await prisma.constructionJob.findMany({
        select: { id: true, name: true, slug: true, icon: true },
        orderBy: { name: "asc" },
    });

    return NextResponse.json({
        jobs,
        status: true,
    });
}
