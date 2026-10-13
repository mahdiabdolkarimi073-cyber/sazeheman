import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireAdmin, getRequestUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const city = url.searchParams.get("city");
    const dashboardType = url.searchParams.get("dashboard_type") || "sazeheman";

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

    const projects = await prisma.constructionProject.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: 50,
        select: {
            id: true,
            project_name: true,
            builder_name: true,
            area: true,
            floors_count: true,
            manager_role: true,
            phone1: isAdmin ? true : false,
            phone2: isAdmin ? true : false,
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
            created_at: true,
        },
    });

    return NextResponse.json({
        projects,
        status: true,
    });
}
