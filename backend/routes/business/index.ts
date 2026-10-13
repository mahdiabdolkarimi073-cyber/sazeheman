import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const city = url.searchParams.get("city");
    const jobId = url.searchParams.get("job_id");
    const search = url.searchParams.get("search");

    const where: any = { status: "approved" };
    if (city) where.city = city;
    if (jobId) where.job_id = jobId;
    if (search) {
        where.OR = [
            { business_name: { contains: search } },
            { full_name: { contains: search } },
        ];
    }

    const businesses = await prisma.business.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: 50,
        select: {
            id: true,
            business_name: true,
            full_name: true,
            job_id: true,
            work_experience: true,
            description: true,
            address: true,
            city: true,
            location_lat: true,
            location_lng: true,
            plan: true,
            phone_verified: true,
            photos: { select: { photo_url: true } },
            job: { select: { name: true, slug: true } },
            created_at: true,
        },
    });

    return NextResponse.json({
        businesses,
        status: true,
    });
}
