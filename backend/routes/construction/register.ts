import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireUser, getRequestUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;

    const required = ["project_name", "builder_name", "phone1"];
    for (const field of required) {
        if (!body[field]) {
            return NextResponse.json({
                message: `${field} الزامی است`,
                status: false,
            }, { status: 400 });
        }
    }

    const existing = await prisma.constructionProject.findFirst({
        where: {
            phone1: body.phone1,
            status: { in: ["pending", "approved"] },
        },
    });

    if (existing) {
        return NextResponse.json({
            message: "پروژه‌ای با این شماره قبلا ثبت شده است",
            status: false,
            existing_id: existing.id,
            existing_status: existing.status,
        }, { status: 409 });
    }

    const currentUser = await getRequestUser();
    const userId = currentUser?.id || null;

    const project = await prisma.constructionProject.create({
        data: {
            user_id: userId,
            project_name: body.project_name,
            builder_name: body.builder_name,
            area: body.area ? parseFloat(body.area) : null,
            start_date: body.start_date || null,
            floors_count: body.floors_count ? parseInt(body.floors_count) : null,
            manager_role: body.manager_role || null,
            phone1: body.phone1,
            phone2: body.phone2 || null,
            phone3: body.phone3 || null,
            email: body.email || null,
            other_contacts: body.other_contacts || null,
            description: body.description || null,
            address: body.address || null,
            city: body.city || null,
            location_lat: body.location_lat ? parseFloat(body.location_lat) : null,
            location_lng: body.location_lng ? parseFloat(body.location_lng) : null,
            photo_url: body.photo_url || null,
            status: "pending",
            phone_verified: false,
        },
    });

    return NextResponse.json({
        message: "پروژه با موفقیت ثبت شد",
        status: true,
        project,
    });
}
