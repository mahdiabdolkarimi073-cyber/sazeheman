import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getRequestUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const city = url.searchParams.get("city");
    const jobId = url.searchParams.get("job_id");
    const search = url.searchParams.get("search");
    const status = url.searchParams.get("status");

    const currentUser = await getRequestUser();
    const isAdmin = currentUser?.role === "admin";

    const where: any = {};
    if (isAdmin && status) {
        where.status = status;
    } else {
        where.status = "approved";
    }
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
        take: 100,
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
            status: true,
            rejection_reason: isAdmin ? true : false,
            user_id: isAdmin ? true : false,
            created_at: true,
            phone: isAdmin ? true : false,
            email: isAdmin ? true : false,
            other_contacts: isAdmin ? true : false,
            photos: { select: { id: true, photo_url: true } },
            job: { select: { id: true, name: true, slug: true } },
        },
    });

    return NextResponse.json({
        businesses,
        status: true,
    });
}
