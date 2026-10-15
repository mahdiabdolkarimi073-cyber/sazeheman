import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireAdmin, getRequestUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const city = url.searchParams.get("city");
    const search = url.searchParams.get("search");
    const withNeeds = url.searchParams.get("with_needs") === "true";

    const currentUser = await getRequestUser();
    const isAdmin = currentUser?.role === "admin";

    if (status && status !== "approved" && !isAdmin) {
        return NextResponse.json({
            message: "دسترسی غیرمجاز",
            status: false,
        }, { status: 403 });
    }

    const where: any = {};
    if (status) {
        where.status = status;
    } else if (!isAdmin) {
        where.status = "approved";
    }

    if (city) {
        where.city = city;
    }

    if (search && isAdmin) {
        where.OR = [
            { project_name: { contains: search } },
            { builder_name: { contains: search } },
            { city: { contains: search } },
        ];
    }

    const projects = await prisma.constructionProject.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: isAdmin ? 100 : 50,
        select: {
            id: true,
            project_name: true,
            builder_name: true,
            area: true,
            start_date: true,
            floors_count: true,
            manager_role: true,
            phone1: isAdmin ? true : false,
            phone2: isAdmin ? true : false,
            phone3: isAdmin ? true : false,
            email: isAdmin ? true : false,
            other_contacts: isAdmin ? true : false,
            description: true,
            address: true,
            city: true,
            location_lat: true,
            location_lng: true,
            photo_url: true,
            phone_verified: true,
            status: true,
            rejection_reason: isAdmin ? true : false,
            user_id: isAdmin ? true : false,
            created_at: true,
            needs: withNeeds && isAdmin ? {
                select: {
                    id: true,
                    job_id: true,
                    description: true,
                    job: { select: { id: true, name: true, slug: true, icon: true } },
                },
            } : false,
        },
    });

    return NextResponse.json({
        projects,
        status: true,
    });
}
