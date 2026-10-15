import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    let currentUser;
    try {
        currentUser = await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    const businesses = await prisma.business.findMany({
        where: { user_id: currentUser.id },
        orderBy: { created_at: "desc" },
        select: {
            id: true,
            business_name: true,
            full_name: true,
            job_id: true,
            work_experience: true,
            phone: true,
            email: true,
            other_contacts: true,
            description: true,
            address: true,
            city: true,
            location_lat: true,
            location_lng: true,
            plan: true,
            phone_verified: true,
            status: true,
            created_at: true,
            job: { select: { id: true, name: true, slug: true } },
            photos: { select: { id: true, photo_url: true } },
        },
    });

    return NextResponse.json({
        businesses,
        status: true,
    });
}
