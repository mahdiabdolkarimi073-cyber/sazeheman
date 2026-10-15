import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireUser, requireAdmin, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const projectId = url.searchParams.get("id");

    if (!projectId) {
        return NextResponse.json({ message: "id الزامی است", status: false }, { status: 400 });
    }

    let currentUser;
    try {
        currentUser = await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    const isAdmin = currentUser.role === "admin";

    const project = await prisma.constructionProject.findUnique({
        where: { id: projectId },
        select: {
            id: true,
            project_name: true,
            builder_name: true,
            area: true,
            start_date: true,
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
            user_id: true,
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

    if (!project) {
        return NextResponse.json({ message: "پروژه یافت نشد", status: false }, { status: 404 });
    }

    const isOwner = project.user_id === currentUser.id;
    if (!isOwner && !isAdmin) {
        return NextResponse.json({ message: "دسترسی غیرمجاز", status: false }, { status: 403 });
    }

    if (req.method === "POST") {
        if (!isOwner) {
            return NextResponse.json({ message: "فقط مالک می‌تواند ویرایش کند", status: false }, { status: 403 });
        }

        const body = await req.json().catch(() => ({})) as Record<string, any>;
        const data: Record<string, any> = {};

        if (body.project_name !== undefined) data.project_name = body.project_name;
        if (body.builder_name !== undefined) data.builder_name = body.builder_name;
        if (body.area !== undefined) data.area = body.area ? parseFloat(body.area) : null;
        if (body.start_date !== undefined) data.start_date = body.start_date || null;
        if (body.floors_count !== undefined) data.floors_count = body.floors_count ? parseInt(body.floors_count) : null;
        if (body.manager_role !== undefined) data.manager_role = body.manager_role || null;
        if (body.phone2 !== undefined) data.phone2 = body.phone2 || null;
        if (body.phone3 !== undefined) data.phone3 = body.phone3 || null;
        if (body.email !== undefined) data.email = body.email || null;
        if (body.other_contacts !== undefined) data.other_contacts = body.other_contacts || null;
        if (body.description !== undefined) data.description = body.description || null;
        if (body.address !== undefined) data.address = body.address || null;
        if (body.city !== undefined) data.city = body.city || null;
        if (body.location_lat !== undefined) data.location_lat = parseFloat(body.location_lat) || null;
        if (body.location_lng !== undefined) data.location_lng = parseFloat(body.location_lng) || null;
        if (body.photo_url !== undefined) data.photo_url = body.photo_url || null;

        const updated = await prisma.constructionProject.update({
            where: { id: projectId },
            data,
            select: {
                id: true,
                project_name: true,
                builder_name: true,
                area: true,
                start_date: true,
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
            message: "به‌روزرسانی شد",
            status: true,
            project: updated,
        });
    }

    return NextResponse.json({
        project,
        status: true,
    });
}
