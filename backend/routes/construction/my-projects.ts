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

    const projects = await prisma.constructionProject.findMany({
        where: { user_id: currentUser.id },
        orderBy: { created_at: "desc" },
        select: {
            id: true,
            project_name: true,
            builder_name: true,
            area: true,
            floors_count: true,
            manager_role: true,
            phone1: true,
            phone2: true,
            phone3: true,
            email: true,
            other_contacts: true,
            description: true,
            address: true,
            city: true,
            location_lat: true,
            location_lng: true,
            photo_url: true,
            phone_verified: true,
            status: true,
            rejection_reason: true,
            created_at: true,
            needs: {
                select: {
                    id: true,
                    job_id: true,
                    description: true,
                    job: { select: { id: true, name: true, slug: true, icon: true } },
                },
            },
        },
    });

    return NextResponse.json({
        projects,
        status: true,
    });
}
