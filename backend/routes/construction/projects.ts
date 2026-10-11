import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    const status = req.nextUrl.searchParams.get("status") || "pending";

    const where = status === "all" ? {} : { status };

    const projects = await prisma.constructionProject.findMany({
        where,
        orderBy: { created_at: "desc" },
    });

    return NextResponse.json({
        projects,
        status: true,
    });
}
